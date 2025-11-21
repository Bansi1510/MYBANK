import express from "express";
import { getUserAccounts, getUserProfile, getUserTransactions, updateUserProfile } from "../controllers/user.controller.js";
import { isUser } from "../middleware/isUser.js";
import { isAuthenticated } from "../middleware/isAutheticated.js";

const UserRouter = express.Router();

UserRouter.get("/profile", isAuthenticated, isUser, getUserProfile);
UserRouter.put("/update-profile", isAuthenticated, isUser, updateUserProfile);
UserRouter.get("/account", isAuthenticated, isUser, getUserAccounts);
UserRouter.get("/account/transactions", isAuthenticated, isUser, getUserTransactions);

export default UserRouter;

