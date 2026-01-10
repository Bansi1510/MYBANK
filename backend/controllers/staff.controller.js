import sql from "../utils/db.js";

export const requestNewAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile_number,
      address,
      aadhar_number,
      pan_number,
      requested_account_type,
      initial_deposit,
      kyc_document_type,
      kyc_document_url,
      created_by
    } = req.body;

    if (!name || !address || !aadhar_number || !requested_account_type) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    const existing = await sql`
      SELECT id FROM account_requests
      WHERE aadhar_number = ${aadhar_number}
    `;

    if (existing.length > 0) {
      return res.status(409).json({ status: false, message: "Account request already exists for this Aadhar" });
    }

    const newRequest = await sql`
      INSERT INTO account_requests (
        name, email, mobile_number, address, aadhar_number, pan_number,
        requested_account_type, initial_deposit, kyc_document_type,
        kyc_document_url, created_by
      )
      VALUES (
        ${name}, ${email}, ${mobile_number}, ${address}, ${aadhar_number}, ${pan_number},
        ${requested_account_type}, ${initial_deposit || 0}, ${kyc_document_type},
        ${kyc_document_url}, ${created_by}
      )
      RETURNING *
    `;

    return res.status(201).json({
      status: true,
      message: "Account request submitted successfully",
      data: newRequest[0]
    });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ status: false, message: err.message });
  }
};