export const createKYC = async (req, res) => {
  try {
    const customer_id = req.id;
    const { pan_number, aadhaar_last4 } = req.body;

    const existing =
      await sql`SELECT kyc_id FROM kyc WHERE customer_id = ${customer_id}`;

    if (existing.length > 0) {
      return res.status(400).json({ message: "KYC already exists" });
    }

    await sql`
      INSERT INTO kyc (customer_id, pan_number, aadhaar_last4)
      VALUES (${customer_id}, ${pan_number}, ${aadhaar_last4})
    `;

    res.json({ message: "KYC submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "KYC submission failed" });
  }
};
export const getPendingKYC = async (req, res) => {
  try {
    const data = await sql`
      SELECT 
        k.kyc_id,
        c.name,
        k.pan_number,
        k.kyc_status,
        k.created_at
      FROM kyc k
      JOIN users c ON c.id = k.customer_id
      WHERE k.kyc_status = 'PENDING'
      ORDER BY k.created_at DESC
    `;

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch pending KYC" });
  }
};
export const getKYCById = async (req, res) => {
  try {
    const { kyc_id } = req.params;

    const kyc = await sql`
      SELECT 
        k.*,
        c.name,
        c.email,
        c.mobile_number
      FROM kyc k
      JOIN users c ON c.id = k.customer_id
      WHERE k.kyc_id = ${kyc_id}
    `;

    const documents = await sql`
      SELECT *
      FROM kyc_documents
      WHERE kyc_id = ${kyc_id}
    `;

    res.json({
      kyc: kyc[0],
      documents,
    });
  } catch {
    res.status(500).json({ message: "Failed to load KYC details" });
  }
};
export const approveKYC = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const staff_id = req.id;

    await sql`
      UPDATE kyc
      SET 
        kyc_status = 'VERIFIED',
        verified_by = ${staff_id},
        verified_at = NOW()
      WHERE kyc_id = ${kyc_id}
    `;

    await sql`
      INSERT INTO kyc_audit_logs (kyc_id, staff_id, action)
      VALUES (${kyc_id}, ${staff_id}, 'APPROVED')
    `;

    res.json({ message: "KYC approved successfully" });
  } catch {
    res.status(500).json({ message: "KYC approval failed" });
  }
};
export const rejectKYC = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const { reason } = req.body;
    const staff_id = req.id;

    await sql`
      UPDATE kyc
      SET 
        kyc_status = 'REJECTED',
        rejection_reason = ${reason}
      WHERE kyc_id = ${kyc_id}
    `;

    await sql`
      INSERT INTO kyc_audit_logs (kyc_id, staff_id, action, remarks)
      VALUES (${kyc_id}, ${staff_id}, 'REJECTED', ${reason})
    `;

    res.json({ message: "KYC rejected" });
  } catch {
    res.status(500).json({ message: "KYC rejection failed" });
  }
};
export const markReKYC = async (req, res) => {
  try {
    const { kyc_id } = req.params;
    const staff_id = req.id;

    await sql`
      UPDATE kyc
      SET kyc_status = 'RE_KYC'
      WHERE kyc_id = ${kyc_id}
    `;

    await sql`
      INSERT INTO kyc_audit_logs (kyc_id, staff_id, action)
      VALUES (${kyc_id}, ${staff_id}, 'RE_KYC')
    `;

    res.json({ message: "Re-KYC requested" });
  } catch {
    res.status(500).json({ message: "Failed to mark Re-KYC" });
  }
};
export const uploadKYCDocument = async (req, res) => {
  try {
    const { kyc_id, doc_type } = req.body;
    const doc_url = req.file.location;

    await sql`
      INSERT INTO kyc_documents (kyc_id, doc_type, doc_url)
      VALUES (${kyc_id}, ${doc_type}, ${doc_url})
    `;

    res.json({ message: "Document uploaded successfully" });
  } catch {
    res.status(500).json({ message: "Document upload failed" });
  }
};
export const updateDocumentStatus = async (req, res) => {
  try {
    const { doc_id } = req.params;
    const { status } = req.body;

    await sql`
      UPDATE kyc_documents
      SET doc_status = ${status}
      WHERE doc_id = ${doc_id}
    `;

    res.json({ message: "Document status updated" });
  } catch {
    res.status(500).json({ message: "Failed to update document" });
  }
};
export const getKYCAuditLogs = async (req, res) => {
  try {
    const { kyc_id } = req.params;

    const logs = await sql`
      SELECT 
        l.*,
        s.name AS staff_name
      FROM kyc_audit_logs l
      JOIN staff_admins s ON s.id = l.staff_id
      WHERE l.kyc_id = ${kyc_id}
      ORDER BY l.created_at DESC
    `;

    res.json(logs);
  } catch {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};
