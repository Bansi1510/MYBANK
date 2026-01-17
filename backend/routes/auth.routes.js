import express from "express";
import {
  loginUser,
  loginStaff,
  loginAdmin,
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
  addAdmin,
  getFullUserProfile
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";

const AuthRouter = express.Router();

AuthRouter.post("/user/login", loginUser);
AuthRouter.post("/staff/login", loginStaff);
AuthRouter.post("/admin/login", loginAdmin);
AuthRouter.post("/user/add-admin", addAdmin);
AuthRouter.post("/user/send-otp", sendOTP);
AuthRouter.post("/user/verify-otp", verifyOTP);
AuthRouter.get("/user/all-details", isAuthenticated, isAdminOrStaff, getFullUserProfile);
AuthRouter.post("/refresh-token", refreshToken);
AuthRouter.post("/logout", logout);

export default AuthRouter;
