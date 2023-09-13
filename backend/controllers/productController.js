const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Create a Product -- Admin
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
    //req.body.user=req.user.id;
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})

//Get All Product
exports.getAllProducts = catchAsyncErrors(async(req, res)=>{

    const resultPerPage = 10;
    const productsCount = await Product.countDocuments();
    console.log(req.query);

    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);

    //const products = await Product.find();
    products = await apiFeature.query.clone();
   //  console.log(await apiFeature);
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })
})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//Get Product Details
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    
    let product;

     product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler(`Product Not Found`,404));
    }

    res.status(200).json({
        success: true,
        product,
    })

})

//Update Products -- Admin
exports.updateProduct=catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

        // Images Start Here
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        if (images !== undefined) {
            // Deleting Images From Cloudinary
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            req.body.images = imagesLinks;
        }

    const options = {
        new:true,
        runValidators:true,
        useFindAndModify:false
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,options);

    res.status(200).json({
        success:true,
        product
    })
}
)
//Delete Products
exports.deleteProduct = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})

// Create new Review or Update the Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    // console.log(rating);
    // console.log(comment);
    // console.log(productId);

    const review = {
        userId: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment // Equivalent to 'comment: comment'
    }

    // console.log(review.userId);
    // console.log(review.name);
    // console.log(review.rating);

    const product = await Product.findById(productId);

    const isReviewed=product.reviews.find(
        (rev) => rev.userId.toString() === req.user._id.toString()
    )

    if(isReviewed){
        product.reviews.forEach((rev) => {
            // console.log(rev.userId.toString());
            // console.log(req.user._id.toString());
            if(rev.userId.toString()===req.user._id.toString()){
              rev.rating=rating;
              rev.comment=comment;
           }
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach(
        (rev)=>{
            avg+=rev.rating;
        });
        
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success:true
    });
})

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Review
exports.deleteReview = catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    // Stores all reviews that are not to be deleted
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev)=>{
        avg += rev.rating;
    });

    let ratings = 0;

    // To prevent divide by zero error
    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    );

    res.status(200).json({
        success: true
    })
})