import express from "express";
import { isAuthenticated } from "../middleware/isAutheticated.js";
import { isAdminOrStaff } from "../middleware/isAdminOrStaff.js";
import { dynamicUpload } from "../middleware/multer.js";

import {
  createKYC,
  getPendingKYC,
  getKYCById,
  uploadKYCDocument,
  updateKYCStatus
} from "../controllers/kyc.controller.js";

const KycRouter = express.Router();

/* ================= CUSTOMER ================= */

// Create KYC
KycRouter.post("/create", isAuthenticated, isAdminOrStaff, createKYC);

// Upload KYC document
KycRouter.post("/document/upload", isAuthenticated, dynamicUpload, uploadKYCDocument);

/* ================= STAFF / ADMIN ================= */

// Get all pending KYC
KycRouter.get("/pending", isAuthenticated, isAdminOrStaff, getPendingKYC);

// Get KYC details by ID
KycRouter.get("/:kyc_id", isAuthenticated, isAdminOrStaff, getKYCById);

KycRouter.put("/:kyc_id/status", isAuthenticated, isAdminOrStaff, updateKYCStatus);
export default KycRouter;
