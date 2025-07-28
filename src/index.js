import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path : './env'
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("App not able to connect with database",error);
        throw error;
    })
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at -> http://localhost:${process.env.PORT || 3000}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection FAILED !!",err)
})





/*
import express from 'express';
const app = express();
(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error',(error) => {
            console.log("App not able to connect with database");
            throw error;
        });

        app.listen(process.env.PORT,() => {
            console.log(`App is listening on PORT ${process.env.PORT}`);
        });
    }
    catch (error){
        console.log("Error: ", error);
        throw error;
    }
})()
*/