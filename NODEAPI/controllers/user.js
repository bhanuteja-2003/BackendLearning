import { User } from "../models/user.js"

export const getAllUsers = async (req,res)=>{

    const users = await User.find({})

    res.status(201).json({
        success:true,
        users
    })
}

export const registerUser = async (req,res)=>{
    const {name ,email, password} = req.body;
    const users = await User.create({
        name,
        email,
        password
    })
    res.json({
        success:true,
        message:"Registered successfully"
    })
}