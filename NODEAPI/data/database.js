import mongoose from "mongoose";

//Database connection: 

export const connectDatabase = ()=>{
        mongoose.connect(process.env.MONGO_URI,{
        dbName:"backendAPI" 
    }).then(()=>{
        console.log("Database Connected");
    }).catch((e)=>{
        console.log(e);
    })
} 