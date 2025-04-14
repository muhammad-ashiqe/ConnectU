import express from "express";
import { login, registerUser, searchUser } from "../controllers/userControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const userRouter = express.Router();


userRouter.post('/register',registerUser)
userRouter.post('/login',login)
userRouter.get('/search',authMiddleware,searchUser)


