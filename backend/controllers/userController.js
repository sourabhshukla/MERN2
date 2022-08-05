const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


//Register a User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop:"scale"
    },
        function(error,result){
        if(error && error.message==="Could not decode base64"){
            return next(new ErrorHandler("Image size should be less than 750KB", 500));
        }
        });

    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 201, res);

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     //user
    //     token
    // });
})

//Login a User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email, password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    // Checks if User as well as password match
    const user = await User.findOne({email: email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatched = await user.comparePasswords(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user, 200, res);

    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success: true,
    //     token
    // })
})

//Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

 // Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // In this case req.protocol=http, req.get("host")=localhost
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have
    not requested this email then, please ignore`

    try{
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    }
    catch(error){
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
    }
})

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req,res,next)=>{
    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match Confirm Password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Login the user
    sendToken(user, 200, res);
})

// Get User Details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: 200,
        user
    })
})

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req,res, next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePasswords(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("passwords do not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save()
        .then(()=>sendToken(user, 200, res))
        .catch((err)=>next(new ErrorHandler(err.message, 400)));
})

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.body.avatar!==""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, // when true it return modified value instead of original one
        runValidation: true,
        useFindAndModify: false // it is deprecated and is true by default so we set it to false
    });

    res.status(200).json({
        success: true
    })
})

// Get all users (admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with id: ${req.params.id}`)
        )
    }

    res.status(200).json({
        success: true,
        user
    })
})

// update user role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true, // when true it return modified value instead of original one
        runValidation: true,
        useFindAndModify: false // it is deprecated and is true by default so we set it to false
    });

    res.status(200).json({
        success: true,
        message: "User Updated Successfully"
    })
})

// delete user -- Admin
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    
    // we will remove cloudinary later for updating avatar

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})