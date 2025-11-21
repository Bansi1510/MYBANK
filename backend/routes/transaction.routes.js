import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { transfer } from "../controllers/transaction.controller.js";

const TransactionRouter = express.Router();

TransactionRouter.put("/transfer", isAuthenticated, isUser, transfer);

export default TransactionRouter;