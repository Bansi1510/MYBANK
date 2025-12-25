import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { applyLoan, getLoanPaymentDetails, getLoanReq, loanDetails, loanPayment, updateLoanStatus } from "../controllers/loan.controller.js";
import { dynamicUpload } from "../middleware/multer.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";

const LoanRoute = express.Router();


LoanRoute.post("/apply-loan", isAuthenticated, isUser, dynamicUpload, applyLoan);
LoanRoute.get("/new-loan-req", isAuthenticated, isAdminOrStaff, getLoanReq);
LoanRoute.patch("/update-loan-status/:loan_id", isAuthenticated, isAdminOrStaff, updateLoanStatus);
LoanRoute.get("/loans", isAuthenticated, loanDetails);
LoanRoute.get("/loans/:loanId", isAuthenticated, loanDetails);
LoanRoute.get("/loans/:loanId/payments", isAuthenticated, getLoanPaymentDetails);
LoanRoute.post("/loans/:loan_id/payment", isAuthenticated, loanPayment);

export default LoanRoute;