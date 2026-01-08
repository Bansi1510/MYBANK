import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isUser } from "../middleware/isUser.js";
import { cardRequestAction, changeCardStatus, getCardDetails, getCardsSummary, getNewCardReqs, myCardAndReq, requestDebitCard } from "../controllers/card.controller.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";


const CardRouter = express.Router();

CardRouter.post('/new-card-req', isAuthenticated, requestDebitCard);
CardRouter.get('/my-card', isAuthenticated, isUser, myCardAndReq)
CardRouter.get('/get-new-card-reqs', isAuthenticated, isAdminOrStaff, getNewCardReqs);
CardRouter.patch('/card-req/update-status', isAuthenticated, isAdminOrStaff, cardRequestAction);
CardRouter.get('/all-cards', isAuthenticated, isAdminOrStaff, getCardsSummary);
CardRouter.get('/card-details/:id', isAuthenticated, isAdminOrStaff, getCardDetails);
CardRouter.patch('/card-change-status', isAuthenticated, changeCardStatus);


export default CardRouter;