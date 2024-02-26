import { User } from "../models/user.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendCookieToken } from "../utils/features.js"
import ErrorHandler from "../middlewares/error.js";

export const userLogin = async (req,res,next)=>{
    try {
        const {email,password}=req.body;
    let user = await User.findOne({email}).select("+password") // By using .select("+password"), we specify that the retrieved document should include the password field.
                                                            // By default, Mongoose excludes certain fields, including password, for security reasons.
                                                            //However, by explicitly selecting the password field with the + prefix, we override this behavior and include the password field in the retrieved document.
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    sendCookieToken(user,res,"Successfully Logged in",200)

    } catch (error) {
        next(error)
    }
}

export const registerUser = async (req,res)=>{
    try {
        const {name,email,password}=req.body;

        let user = await User.findOne({email});
        // if user doesn't exist
        if(!user){
            //create user :
            // hash password :
            const hashedPassword = await bcrypt.hash(password,10)
            //created user
            user= await User.create({name,email,password:hashedPassword})
            // in response send cookie and use JWT to encrypt the token value.
            sendCookieToken(user,res,"User Registered Successfully",201);
        }
        // if user already exists then :
        else{
            return next(new ErrorHandler("User Already Exists", 400))
        }
        
    } catch (error) {
        next(error)
    }
}

export const getMyProfile =  (req,res)=>{

    // console.log(decoded);
    res.status(200).json({
        success:true,
        user:req.user
    })
}

export const userLogout=(req,res)=>{
    
    res.status(200).cookie("token","",{
        expires:new Date(Date.now())
    }).json({
        success:true,
        user: req.user
    })
    
}
