const mongoose = require('mongoose');
const dotenv=require('dotenv');

dotenv.config({path: "backend/config/config.env"});

const MONGO_URL = process.env.MONGO_URL;

const connectDatabase = ()=> {
    mongoose.connect(MONGO_URL).then((data)=>{
        console.log(`Mongodb connected with server ${data.connection.host}`);
    })
    // .catch((err)=>{
    //     console.log(err);
    // })
    // No need to add catch block when using unhandled promise rejection
}

module.exports = connectDatabase;