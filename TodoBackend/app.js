import express from "express";
import userRoute from './routes/user.js'
import taskRoute from './routes/task.js'
import {config} from 'dotenv';
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

export const app = express();
const router = express.Router();

// to access ENV file
config({
    path:'./data/config.env'
})

// using middlewares
app.use(express.json());
app.use(cookieParser());
// using routes
app.use("/api/v1/users",userRoute);
app.use("/api/v1/task",taskRoute);


app.get('/',(req,res)=>{
    res.send("Working");
})

// error middleware
app.use(errorMiddleware)


