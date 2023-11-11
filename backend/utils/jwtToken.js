const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //options for cookie
    const options = {
        httpOnly: true,
        // expires: new Date(
        //     // Time in milliseconds
        //     Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        // )
        maxAge: 3600000,
        secure:false
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    })
}

module.exports = sendToken;
