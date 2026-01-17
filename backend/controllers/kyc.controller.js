import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sql from "../utils/db.js";


export const createKYC = async (req, res) => {
  try {
    const customer_id = req.id; // from JWT
    const { pan_number, aadhaar_last4 } = req.body;

    const existing = await sql`
      SELECT kyc_id FROM kyc WHERE customer_id = ${customer_id}
    `;

    if (existing.length > 0) {
      return res.status(400).json({ message: "KYC already exists" });
    }

    await sql`
      INSERT INTO kyc (customer_id, pan_number, aadhaar_last4)
      VALUES (${customer_id}, ${pan_number}, ${aadhaar_last4})
    `;

    res.json({ message: "KYC submitted successfully" });
  } catch {
    res.status(500).json({ message: "KYC submission failed" });
  }
};

// Upload KYC document
export const uploadKYCDocument = async (req, res) => {
  try {
    const { kyc_id, doc_type } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileUri = getDataUri(file).content;

      const result = await cloudinary.uploader.upload(fileUri, {
        folder: `kyc_documents/${kyc_id}`,
      });

      await sql`
        INSERT INTO kyc_documents (kyc_id, doc_type, doc_url)
        VALUES (${kyc_id}, ${doc_type}, ${result.secure_url})
      `;

      uploadedFiles.push(result.secure_url);
    }

    res.json({
      message: "Document(s) uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Document upload failed" });
  }
};
// ================= STAFF / ADMIN =================

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

    res.json(data);
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

    const documents = await sql`
      SELECT * FROM kyc_documents WHERE kyc_id = ${kyc_id}
    `;

    res.json({ kyc: kyc[0], documents });
  } catch {
    res.status(500).json({ message: "Failed to load KYC details" });
  }
};

// Approve KYC
export const approveKYC = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const staff_id = req.id;

    await sql`
      UPDATE kyc
      SET kyc_status = 'VERIFIED',
          verified_by = ${staff_id},
          verified_at = NOW()
      WHERE kyc_id = ${kyc_id}
    `;

    res.json({ message: "KYC approved successfully" });
  } catch {
    res.status(500).json({ message: "KYC approval failed" });
  }
};

// Reject KYC
export const rejectKYC = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const { reason } = req.body;

    await sql`
      UPDATE kyc
      SET kyc_status = 'REJECTED',
          rejection_reason = ${reason}
      WHERE kyc_id = ${kyc_id}
    `;

    res.json({ message: "KYC rejected" });
  } catch {
    res.status(500).json({ message: "KYC rejection failed" });
  }
};
