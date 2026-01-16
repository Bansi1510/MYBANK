import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { cashTransactionByStaff, downloadStatement, getTransactionHistory, getTransactionsForStaff, transactionByStaff, transactionSummary, transferViaAcc, transferViaMobile } from "../controllers/transaction.controller.js";
import { isStaff } from "../middleware/isStaff.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";

const TransactionRouter = express.Router();

TransactionRouter.put("/transfer-acc", isAuthenticated, isUser, transferViaAcc);
TransactionRouter.get("/history", isAuthenticated, isUser, getTransactionHistory);
TransactionRouter.get("/download-statement", isAuthenticated, isUser, downloadStatement);
TransactionRouter.put("/transfer-mobile", isAuthenticated, isUser, transferViaMobile);
TransactionRouter.get("/acc-transactions", isAuthenticated, isAdminOrStaff, getTransactionsForStaff);
TransactionRouter.post("/staff/transaction", isAuthenticated, isStaff, transactionByStaff);
TransactionRouter.post("/staff/cash-transaction", isAuthenticated, isStaff, cashTransactionByStaff);
TransactionRouter.get("/summary", isAuthenticated, isAdminOrStaff, transactionSummary);

export default TransactionRouter;