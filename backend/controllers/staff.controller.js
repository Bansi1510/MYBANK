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
      created_by,
    } = req.body;

    if (!name || !address || !aadhar_number || !requested_account_type) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const existing = await sql`
      SELECT id FROM account_requests
      WHERE aadhar_number = ${aadhar_number}
    `;

    if (existing.length > 0) {
      return res
        .status(409)
        .json({
          status: false,
          message: "Account request already exists for this Aadhar",
        });
    }

    const newRequest = await sql`
      INSERT INTO account_requests (
        name, email, mobile_number, address, aadhar_number, pan_number,
        requested_account_type, initial_deposit, kyc_document_type,
        kyc_document_url, created_by
      )
      VALUES (
        ${name}, ${email}, ${mobile_number}, ${address}, ${aadhar_number}, ${pan_number},
        ${requested_account_type}, ${initial_deposit || 0
      }, ${kyc_document_type},
        ${kyc_document_url}, ${created_by}
      )
      RETURNING *
    `;

    return res.status(201).json({
      status: true,
      message: "Account request submitted successfully",
      data: newRequest[0],
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: err.message });
  }
};
export const getUserDetailsByStaff = async (req, res) => {
  try {
    const { account_number, aadhar_number } = req.query;

    if (!account_number || !aadhar_number) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const result = await sql`
      SELECT
        u.id,
        u.name,
        u.email,
        u.mobile_number,
        u.aadhar_number,
        a.account_number,
        a.account_type,
        a.balance
      FROM users u
      JOIN accounts a ON a.user_id = u.id
      WHERE u.aadhar_number = ${aadhar_number}
        AND a.account_number = ${account_number}
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User or account not found",
      });
    }

    return res.status(200).json({
      status: true,
      user: result[0],
    });
  } catch (err) {
    console.error("Staff fetch error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
export const updateUserDetails = async (req, res) => {
  const { account_number, aadhar_number, name, email, mobile_number, account_type } = req.body;

  if (!account_number || !aadhar_number) {
    return res.status(400).json({
      message: "Account number and Aadhaar number required",
    });
  }

  try {

    const accountResult = await pool.query(
      `
      SELECT a.account_id, u.user_id
      FROM accounts a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.account_number = $1
        AND u.aadhar_number = $2
      `,
      [account_number, aadhar_number]
    );

    if (accountResult.rows.length === 0) {
      return res.status(404).json({
        message: "Account or user not found",
      });
    }

    const { user_id, account_id } = accountResult.rows[0];


    await pool.query(
      `
      UPDATE users
      SET
        name = $1,
        email = $2,
        mobile_number = $3
      WHERE user_id = $4
      `,
      [name, email, mobile_number, user_id]
    );


    await pool.query(
      `
      UPDATE accounts
      SET account_type = $1
      WHERE account_id = $2
      `,
      [account_type, account_id]
    );

    return res.status(200).json({
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
