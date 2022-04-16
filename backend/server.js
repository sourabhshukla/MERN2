const app =require('./app');
const dotenv=require('dotenv');
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");
const ErrorHandler = require("./utils/errorHandler");

// Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

if (process.env.NODE_ENV!=="PRODUCTION") {
    dotenv.config({path: "backend/config/config.env"});
}

const port = process.env.PORT;

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//console.log(youtube);

//Unhandled Promise Rejection(eg: when MONGO_URL is incorrect)
process.on("unhandledRejection", (err)=>{
    if(err.name==="ValidationError"){
        const message=err.message;
        err=new ErrorHandler(message, 400);
        return next(new ErrorHandler("validation error bla bla", 400));
    }
    console.log(`Error: ${err.message} \n ${err.stack}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})