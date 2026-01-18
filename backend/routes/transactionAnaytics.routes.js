import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { getAllTransactions, getTransactionAnalysis } from "../controllers/transactionAnaytics.controller.js";

const TransactionAnayticsRouter = express.Router();

TransactionAnayticsRouter.get("/all", isAuthenticated, isAdmin, getAllTransactions);
TransactionAnayticsRouter.get("/analysis", isAuthenticated, isAdmin, getTransactionAnalysis);

export default TransactionAnayticsRouter;