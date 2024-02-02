import express, { urlencoded } from "express";
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const app = express();

// setting up view engine for ejs template
app.set("view engine","ejs");
app.use(express.static(path.join(path.resolve(), "\public")));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//Database connection: 
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend" 
}).then(()=>{
    console.log("Database Connected");
}).catch((e)=>{
    console.log(e);
})

// Creating Schema(document structure)
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

// Integrated collection to documents

const User = mongoose.model("User", userSchema);

const isAuthentication = async (req,res,next)=>{
    const {token}  = req.cookies;
    if(token){
        const decoded = jwt.verify(token ,"kjahbkaaajdjabdjfbdnjbfdkfbdk");
        req.user = await User.findById(decoded._id)
        next();
    }
    else{
        res.render("login");
    } 
}


app.get("/",isAuthentication,(req,res)=>{
    // const directoryName = path.resolve(); // provides current folder address
    // res.sendFile(path.join(directoryName ,'\index.html'));
    

    res.render("logout",{name:req.user.name});
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/register' , (req,res)=>{
    res.render('register');
})

app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    let user = await User.findOne({email})
    if(user){
        return res.redirect('/login');
    }
    const hashedPassword = await bcrypt.hash(password,10); 
    user=  await User.create({name,email,password:hashedPassword})
   const token = jwt.sign({_id:user._id ,},"kjahbkaaajdjabdjfbdnjbfdkfbdk")
    res.cookie("token",token);
    res.redirect('/')
})

app.post("/login",async (req,res)=>{ 
    const {email,password} = req.body;
    let user = await User.findOne({email});
    if(!user){
        return res.redirect('/register');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        return res.render('login',{email, message:"Incorrect Password"})
    }
    const token = jwt.sign({_id:user._id ,},"kjahbkaaajdjabdjfbdnjbfdkfbdk")
    res.cookie("token",token);
    res.redirect('/')
})

app.get("/logout",(req,res)=>{ 
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.redirect('/')
})

app.listen(3000,()=>{
    console.log("server listening at port 3000");
})