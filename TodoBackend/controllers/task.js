import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req,res,next)=>{
    try {
        const {title,description} =  req.body;

        await Task.create({
            title,
            description,
            user:req.user
        })
    
        res.status(201).json({
            success:true,
            message:"New Task Created"
        })
        
    } catch (error) {
        next(error)
    }
};

export const userTask = async (req,res,next)=>{
    try {
        const userid = req.user._id;

        const tasks = await Task.find({user:userid});
        res.status(200).json({
            success:true,
            tasks
        })
    } catch (error) {
        next(error)
    }
}

export const updateTask = async (req,res,next)=>{
    try {
        const task = await Task.findById(req.params.id)
        if(!task){
            console.log("error");
            // can use the below one also but we will not be able to send the staus code as the parameter.
            // So i created a class which extends this and accepts two parameters.
            // return next(new Error("Task Not Found"))
            return next(new ErrorHandler("Task Not Found", 404))
        }
        task.isCompleted = !task.isCompleted
        await task.save();
        
        res.status(200).json({
            success:true,
            message:"Task updated"
        })
    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (req,res,next)=>{
    try {
        const task = await Task.findById(req.params.id)
        if(!task){
    // can use the below one also but we will not be able to send the staus code as the parameter.
    // So i created a class which extends this and accepts two parameters.
    // return next(new Error("Task Not Found"))
            return next(new ErrorHandler("Task Not Found", 404))
        }
        await task.deleteOne();
    
        res.status(200).json({
            success:true,
        })
    } catch (error) {
        next(error)
    }
}