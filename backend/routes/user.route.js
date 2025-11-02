import express from "express";
import { signup } from "../controllers/user.controller.js";

const userRoute = express.Router();


userRoute.post("/signup", signup);



export default userRoute;