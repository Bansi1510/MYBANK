import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { applyLoan, getLoanReq } from "../controllers/loan.controller.js";
import { dynamicUpload } from "../middleware/multer.js";
import { isStaff } from "../middleware/isStaff.js";

const LoanRoute = express.Router();


LoanRoute.post("/apply-loan", isAuthenticated, isUser, dynamicUpload, applyLoan);
LoanRoute.get("/show-loan-req", isAuthenticated, isStaff, getLoanReq);
export default LoanRoute;