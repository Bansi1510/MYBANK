import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { approveAccount } from "../controllers/account.controller.js";

const AccountRouter = express.Router();

AccountRouter.put("/approve/:requestId", isAuthenticated, isAdmin, approveAccount)

export default AccountRouter;