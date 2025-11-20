import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isStaff } from "../middleware/isStaff.js";
import { requestNewAccount } from "../controllers/staff.controller.js";


const StaffRouter = express.Router();

StaffRouter.post("/new-account", isAuthenticated, isStaff, requestNewAccount);

export default StaffRouter;