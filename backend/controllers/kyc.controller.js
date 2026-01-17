import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sql from "../utils/db.js";



export const createKYC = async (req, res) => {
  try {

    const { account_number, pan_number, aadhaar_last4 } = req.body;

    if (!account_number) {
      return res.status(400).json({ status: false, message: "Account number is required" });
    }
    const user = await sql`
      SELECT user_id FROM accounts WHERE account_number = ${account_number}
    `;

    if (!user || user.length === 0) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    const customer_id = user[0].user_id;

    // Check if KYC already exists for this customer
    const existing = await sql`
      SELECT kyc_id FROM kyc WHERE customer_id = ${customer_id} AND kyc_status='VERIFIED'
    `;

    if (existing.length > 0) {
      return res.status(400).json({ status: false, message: "KYC already exists for this customer" });
    }

    // Insert KYC
    await sql`
      INSERT INTO kyc (customer_id, pan_number, aadhaar_last4)
      VALUES (${customer_id}, ${pan_number}, ${aadhaar_last4})
    `;

    res.json({ status: true, message: "KYC created successfully", customer_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "KYC creation failed" });
  }
};
// Get all pending KYC
export const getPendingKYC = async (req, res) => {
  try {
    const data = await sql`
      SELECT k.kyc_id, u.name, k.pan_number, k.kyc_status, k.created_at
      FROM kyc k
      JOIN users u ON u.id = k.customer_id
      WHERE k.kyc_status = 'PENDING'
      ORDER BY k.created_at DESC
    `;

    res.status(200).json({
      status: true,
      data
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch pending KYC" });
  }
};

// Get KYC details by ID (with documents)
export const getKYCById = async (req, res) => {
  try {
    const { kyc_id } = req.params;

    const kyc = await sql`
      SELECT k.*, u.name, u.email, u.mobile_number
      FROM kyc k
      JOIN users u ON u.id = k.customer_id
      WHERE k.kyc_id = ${kyc_id}
    `;
    res.status(200).json({ status: true, kyc: kyc[0] });
  } catch {
    res.status(500).json({ status: false, message: "Failed to load KYC details" });
  }
};

// Approve KYC
export const updateKYCStatus = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const { status, reason } = req.body;
    const staff_id = req.id;

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid KYC status" });
    }

    // Build SQL dynamically based on status
    if (status === "VERIFIED") {
      await sql`
        UPDATE kyc
        SET kyc_status = 'VERIFIED',
            verified_by = ${staff_id},
            verified_at = NOW()
        WHERE kyc_id = ${kyc_id}
      `;
    } else if (status === "REJECTED") {
      if (!reason) {
        return res
          .status(400)
          .json({ status: false, message: "Rejection reason required" });
      }
      await sql`
        UPDATE kyc
        SET kyc_status = 'REJECTED',
            rejection_reason = ${reason}
        WHERE kyc_id = ${kyc_id}
      `;
    }

    res
      .status(200)
      .json({ status: true, message: `KYC ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "KYC update failed" });
  }
};
export const getAllKYCs = async (req, res) => {
  try {
    const { status } = req.query;
    let kycs;

    if (status) {
      kycs = await sql`
        SELECT 
          k.kyc_id,
          k.customer_id,
          u.name,
          a.account_number,
          k.pan_number,
          k.aadhaar_last4,
          k.kyc_status,
          k.verified_by,
          k.verified_at,
          k.rejection_reason,
          k.created_at
        FROM kyc k
        JOIN users u ON u.id = k.customer_id
        JOIN accounts a ON a.user_id = u.id
        WHERE k.kyc_status = ${status}
        ORDER BY k.created_at DESC
      `;
    } else {
      kycs = await sql`
        SELECT 
          k.kyc_id,
          k.customer_id,
          u.name,
          a.account_number,
          k.pan_number,
          k.aadhaar_last4,
          k.kyc_status,
          k.verified_by,
          k.verified_at,
          k.rejection_reason,
          k.created_at
        FROM kyc k
        JOIN users u ON u.id = k.customer_id
        JOIN accounts a ON a.user_id = u.id
        ORDER BY k.created_at DESC
      `;
    }

    res.status(200).json({
      status: true,
      data: kycs,
    });
  } catch (err) {
    console.error("Get KYC Error:", err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch KYC details",
    });
  }
};