import express from "express";
import { addStaff, deleteStaff, getAllAccountRequests, getAllStaff, updateStaff } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const AdminRouter = express.Router();

AdminRouter.post("/add-staff", isAuthenticated, isAdmin, addStaff);
AdminRouter.post("/update-staff/:staff_id", isAuthenticated, isAdmin, updateStaff);
AdminRouter.get("/all-staff", isAuthenticated, isAdmin, getAllStaff);
AdminRouter.delete("/delete-staff/:staff_id", isAuthenticated, isAdmin, deleteStaff);
AdminRouter.get("/all-account-reqest", isAuthenticated, isAdmin, getAllAccountRequests);



export default AdminRouter;