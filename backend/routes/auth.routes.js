import express from "express";
import {
  loginUser,
  loginStaff,
  loginAdmin,
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
  addAdmin
} from "../controllers/auth.controller.js";

const Authrouter = express.Router();

Authrouter.post("/user/login", loginUser);
Authrouter.post("/staff/login", loginStaff);
Authrouter.post("/admin/login", loginAdmin);
Authrouter.post("/user/add-admin", addAdmin);
Authrouter.post("/user/send-otp", sendOTP);
Authrouter.post("/user/verify-otp", verifyOTP);

Authrouter.post("/refresh-token", refreshToken);
Authrouter.post("/logout", logout);

export default Authrouter;
