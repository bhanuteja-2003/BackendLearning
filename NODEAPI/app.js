import express from "express";
import userRoute from './routes/user.js'
import {config} from 'dotenv';

export const app = express();
const router = express.Router();

config({
    path:'./data/config.env'
})

// using middlewares
app.use(express.json());
app.use("/users",userRoute);


app.get('/',(req,res)=>{
    res.send("Working");
})


