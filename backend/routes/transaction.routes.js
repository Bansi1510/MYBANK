import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { downloadStatement, getTransactionHistory, transfer } from "../controllers/transaction.controller.js";

const TransactionRouter = express.Router();

TransactionRouter.put("/transfer", isAuthenticated, isUser, transfer);
TransactionRouter.get("/history", isAuthenticated, isUser, getTransactionHistory);
TransactionRouter.get("/download-statement", isAuthenticated, isUser, downloadStatement);



export default TransactionRouter;