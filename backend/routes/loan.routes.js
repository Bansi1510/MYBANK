import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { applyLoan, getLoanReq, updateLoanStatus } from "../controllers/loan.controller.js";
import { dynamicUpload } from "../middleware/multer.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";

const LoanRoute = express.Router();


LoanRoute.post("/apply-loan", isAuthenticated, isUser, dynamicUpload, applyLoan);
LoanRoute.get("/new-loan-req", isAuthenticated, isAdminOrStaff, getLoanReq);
LoanRoute.patch("/update-loan-status/:loan_id", isAuthenticated, isAdminOrStaff, updateLoanStatus);

export default LoanRoute;