import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { downloadStatement, getTransactionHistory, transferViaAcc, transferViaMobile } from "../controllers/transaction.controller.js";

const TransactionRouter = express.Router();

TransactionRouter.put("/transfer-acc", isAuthenticated, isUser, transferViaAcc);
TransactionRouter.get("/history", isAuthenticated, isUser, getTransactionHistory);
TransactionRouter.get("/download-statement", isAuthenticated, isUser, downloadStatement);
TransactionRouter.put("/transfer-mobile", isAuthenticated, isUser, transferViaMobile);


export default TransactionRouter;