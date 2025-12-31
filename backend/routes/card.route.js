import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated";
import { isUser } from "../middleware/isUser";
import { cardRequestAction, getCardDetails, getCardsSummary, getNewCardReqs, requestDebitCard } from "../controllers/card.controller";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff";


const CardRouter = express.Router();

CardRouter.post('/new-card-req', isAuthenticated, isUser, requestDebitCard);
CardRouter.get('/get-new-card-reqs', isAuthenticated, isAdminOrStaff, getNewCardReqs);
CardRouter.patch('/card-req/update-status', isAuthenticated, isAdminOrStaff, cardRequestAction);
CardRouter.get('/all-cards', isAuthenticated, isAdminOrStaff, getCardsSummary);
CardRouter.get('/card-details/:account_number', isAuthenticated, isAdminOrStaff, getCardDetails);


export default CardRouter;