import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { cardRequestAction, getCardDetails, getCardsSummary, getNewCardReqs, requestDebitCard } from "../controllers/card.controller.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";


const CardRouter = express.Router();

CardRouter.post('/new-card-req', isAuthenticated, requestDebitCard);
CardRouter.get('/get-new-card-reqs', isAuthenticated, isAdminOrStaff, getNewCardReqs);
CardRouter.patch('/card-req/update-status', isAuthenticated, isAdminOrStaff, cardRequestAction);
CardRouter.get('/all-cards', isAuthenticated, isAdminOrStaff, getCardsSummary);
CardRouter.get('/card-details/:account_number', isAuthenticated, isAdminOrStaff, getCardDetails);


export default CardRouter;