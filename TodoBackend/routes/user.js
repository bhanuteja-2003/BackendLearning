import express from "express";
import {User} from "../models/user.js"
import { registerUser,userLogin,getMyProfile ,userLogout} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post('/register',registerUser)
router.post('/login',userLogin)
router.get('/logout', userLogout);
router.get('/profile',isAuthenticated, getMyProfile)
export default router;