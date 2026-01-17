import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";
import { dynamicUpload } from "../middleware/multer.js";

import {
  createKYC,
  getPendingKYC,
  getKYCById,
  updateKYCStatus,
  getAllKYCs
} from "../controllers/kyc.controller.js";

const KycRouter = express.Router();

/* ================= CUSTOMER ================= */

// Create KYC
KycRouter.post("/create", isAuthenticated, isAdminOrStaff, createKYC);

// Upload KYC document

/* ================= STAFF / ADMIN ================= */

// Get all pending KYC
KycRouter.get("/pending", isAuthenticated, isAdminOrStaff, getPendingKYC);
KycRouter.get("/all-kyc", isAuthenticated, isAdminOrStaff, getAllKYCs);
// Get KYC details by ID
KycRouter.get("/:kyc_id", isAuthenticated, isAdminOrStaff, getKYCById);
KycRouter.put("/:kyc_id/status", isAuthenticated, isAdminOrStaff, updateKYCStatus);
export default KycRouter;
