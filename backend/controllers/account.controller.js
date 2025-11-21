import sql from "../utils/db.js"
import sendEmail from "../utils/sendEmail.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";
import bcrypt from "bcrypt";

export const approveAccount = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const staffId = req.id;

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ status: false, message: "Invalid action" });
    }

    const rows = await sql`SELECT * FROM account_requests WHERE id = ${requestId}`;
    if (!rows.length) {
      return res.status(404).json({ status: false, message: "Request not found" });
    }

    const r = rows[0];

    const existingUser = await sql`
      SELECT id FROM users WHERE aadhar_number = ${r.aadhar_number}
    `;
    console.log(r)
    if (existingUser.length) {
      await sql`
        INSERT INTO account_request_history (
            name, email, mobile_number, address,
          aadhar_number, pan_number, requested_account_type,
          initial_deposit, kyc_document_type, kyc_document_url,
          final_status, decided_by
        )
        VALUES (
            ${r.name}, ${r.email}, ${r.mobile_number}, ${r.address},
          ${r.aadhar_number}, ${r.pan_number}, ${r.requested_account_type},
          ${r.initial_deposit}, ${r.kyc_document_type}, ${r.kyc_document_url},
          'rejected', ${staffId}
        )
      `;

      await sql`DELETE FROM account_requests WHERE id = ${requestId}`;

      await sendEmail(r.email, "Account Request Rejected", "Aadhar already exists in our records.");

      return res.json({ status: false, message: "Duplicate Aadhar, request rejected" });
    }

    if (action === "rejected") {
      await sql`
        INSERT INTO account_request_history (
            name, email, mobile_number, address,
          aadhar_number, pan_number, requested_account_type,
          initial_deposit, kyc_document_type, kyc_document_url,
          final_status, decided_by
        )
        VALUES (
          ${r.name}, ${r.email}, ${r.mobile_number}, ${r.address},
          ${r.aadhar_number}, ${r.pan_number}, ${r.requested_account_type},
          ${r.initial_deposit}, ${r.kyc_document_type}, ${r.kyc_document_url},
          'rejected', ${staffId}
        )
      `;

      await sql`DELETE FROM account_requests WHERE id = ${requestId}`;
      await sendEmail(r.email, "Account Request Rejected", "Your request has been rejected.");

      return res.json({ status: true, message: "Request rejected" });
    }

    const hashed = await bcrypt.hash("User@123", 10);

    const newUser = await sql`
      INSERT INTO users (
        name, email, mobile_number, password, address,
        aadhar_number, pan_number, kyc_verified,
        kyc_method, kyc_document_url, created_by
      )
      VALUES (
        ${r.name}, ${r.email}, ${r.mobile_number}, ${hashed}, ${r.address},
        ${r.aadhar_number}, ${r.pan_number}, true,
        ${r.kyc_document_type}, ${r.kyc_document_url}, ${staffId}
      )
      RETURNING id
    `;

    const accNo = await generateAccountNumber();

    await sql`
      INSERT INTO accounts (
        user_id, account_number, account_type,
        balance, created_by
      )
      VALUES (
        ${newUser[0].id}, ${accNo}, ${r.requested_account_type},
        ${r.initial_deposit}, ${staffId}
      )
    `;

    await sql`
      INSERT INTO account_request_history (
          name, email, mobile_number, address,
        aadhar_number, pan_number, requested_account_type,
        initial_deposit, kyc_document_type, kyc_document_url,
        final_status, decided_by
      )
      VALUES (
         ${r.name}, ${r.email}, ${r.mobile_number}, ${r.address},
        ${r.aadhar_number}, ${r.pan_number}, ${r.requested_account_type},
        ${r.initial_deposit}, ${r.kyc_document_type}, ${r.kyc_document_url},
        'approved', ${staffId}
      )
    `;

    await sql`DELETE FROM account_requests WHERE id = ${requestId}`;

    await sendEmail(
      r.email,
      "Account Approved",
      `Your bank account is approved. Your account number is ${accNo}.`
    );

    res.json({ status: true, message: "Account approved", account_number: accNo });

  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};


export const getAccountByNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const acc = await sql`
      SELECT 
        a.id AS account_id,
        a.account_number,
        a.account_type,
        a.balance,
        a.status,
        a.created_at AS account_created_at,

        u.id AS user_id,
        u.name,
        u.email,
        u.mobile_number,
        u.address,
        u.aadhar_number,
        u.pan_number,
        u.kyc_verified,
        u.kyc_method,
        u.kyc_document_url,
        u.created_at AS user_created_at

      FROM accounts a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.account_number = ${accountNumber}
    `;

    if (!acc.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    res.json({ status: true, data: acc[0] });

  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};


export const updateAccountStatus = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "closed", "suspended", "frozen"].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status" });
    }

    const updated = await sql`
      UPDATE accounts
      SET status = ${status}
      WHERE account_number = ${accountNumber}
      RETURNING *
    `;

    if (!updated.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    res.json({ status: true, message: "Status updated", data: updated[0] });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const getAccountBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const rows = await sql`
      SELECT balance FROM accounts
      WHERE account_number = ${accountNumber}
    `;
    if (!rows.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    res.json({ status: true, balance: rows[0].balance });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const updateAccountBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { amount, type } = req.body;

    if (!["deposit", "withdraw"].includes(type)) {
      return res.status(400).json({ status: false, message: "Invalid transaction type" });
    }

    const acc = await sql`
      SELECT * FROM accounts
      WHERE account_number = ${accountNumber}
    `;
    if (!acc.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    let newBalance =
      type === "deposit"
        ? Number(acc[0].balance) + Number(amount)
        : Number(acc[0].balance) - Number(amount);

    if (newBalance < 0) {
      return res.status(400).json({ status: false, message: "Insufficient balance" });
    }

    const updated = await sql`
      UPDATE accounts
      SET balance = ${newBalance}
      WHERE account_number = ${accountNumber}
      RETURNING balance
    `;

    res.json({ status: true, balance: updated[0].balance });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
