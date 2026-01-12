import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { applyLoan, getLoanPaymentDetails, getLoanReq, getLoanReqById, loanDetails, loanPayment, updateLoanStatus } from "../controllers/loan.controller.js";
import { dynamicUpload } from "../middleware/multer.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";

const LoanRoute = express.Router();


LoanRoute.post("/apply-loan", isAuthenticated, dynamicUpload, applyLoan);
LoanRoute.get("/new-loan-req", isAuthenticated, isAdminOrStaff, getLoanReq);
LoanRoute.get("/new-loan-req/:loanReqId", isAuthenticated, isAdminOrStaff, getLoanReqById);
LoanRoute.patch("/update-loan-status/:loan_id", isAuthenticated, isAdminOrStaff, updateLoanStatus);
LoanRoute.get("/loans", isAuthenticated, loanDetails);
LoanRoute.get("/loans/:loanId", isAuthenticated, loanDetails);
LoanRoute.get("/:policyNumber/payment-detail", isAuthenticated, getLoanPaymentDetails);
LoanRoute.post("/payment", isAuthenticated, loanPayment);

export default LoanRoute;