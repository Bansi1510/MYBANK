import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { cashTransactionByStaff, downloadStatement, getTransactionHistory, transactionByStaff, transferViaAcc, transferViaMobile } from "../controllers/transaction.controller.js";
import { isStaff } from "../middleware/isStaff.js";

const TransactionRouter = express.Router();

TransactionRouter.put("/transfer-acc", isAuthenticated, isUser, transferViaAcc);
TransactionRouter.get("/history", isAuthenticated, isUser, getTransactionHistory);
TransactionRouter.get("/download-statement", isAuthenticated, isUser, downloadStatement);
TransactionRouter.put("/transfer-mobile", isAuthenticated, isUser, transferViaMobile);
TransactionRouter.post("/staff/transaction", isAuthenticated, isStaff, transactionByStaff);
TransactionRouter.post("/staff/cash-transaction", isAuthenticated, isStaff, cashTransactionByStaff);
export default TransactionRouter;