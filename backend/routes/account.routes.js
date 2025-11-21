import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { approveAccount, getAccountBalance, getAccountByNumber, updateAccountBalance, updateAccountStatus } from "../controllers/account.controller.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";
const AccountRouter = express.Router();

AccountRouter.put("/approve/:requestId", isAuthenticated, isAdmin, approveAccount)
AccountRouter.get("/:accountNumber", isAuthenticated, isAdminOrStaff, getAccountByNumber);
AccountRouter.put("/:accountNumber/status", isAuthenticated, isAdminOrStaff, updateAccountStatus);
AccountRouter.get("/:accountNumber/balance", isAuthenticated, isAdminOrStaff, getAccountBalance);
AccountRouter.put("/:accountNumber/update-balance", isAuthenticated, isAdminOrStaff, updateAccountBalance);

export default AccountRouter;