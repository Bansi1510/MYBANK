import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { allAcc, chnageAccountStatus, getAccountBalance, getAccountByNumber, newAccReqHistory, updateAccountBalance, updateAccountStatus } from "../controllers/account.controller.js";

import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";

const AccountRouter = express.Router();

AccountRouter.put("/change-status/:requestId", isAuthenticated, isAdmin, chnageAccountStatus);
AccountRouter.get("/new-acc-req-his", isAuthenticated, isAdmin, newAccReqHistory);
AccountRouter.get("/all-acc", isAuthenticated, isAdminOrStaff, allAcc);
AccountRouter.get("/:accountNumber", isAuthenticated, isAdminOrStaff, getAccountByNumber);
AccountRouter.put("/:accountNumber/status-update", isAuthenticated, isAdminOrStaff, updateAccountStatus);
AccountRouter.get("/:accountNumber/balance", isAuthenticated, isAdminOrStaff, getAccountBalance);
AccountRouter.put("/:accountNumber/update-balance", isAuthenticated, isAdminOrStaff, updateAccountBalance);


export default AccountRouter;