import sql from "../utils/db.js"
import sendEmail from "../utils/sendEmail.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";
import bcrypt from "bcrypt";


export const newAccReqHistory = async (req, res) => {

  try {
    const adminId = req.id;

    const rows = await sql`SELECT * FROM account_request_history WHERE decided_by=${adminId}`;

    if (rows.length < 1) {
      return res.status(200).json({
        status: "true",
        message: "no history",
        data: []
      })
    }

    return res.status(200).json({
      status: true,
      message: "Account History",
      data: rows
    })

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export const allAcc = async (req, res) => {
  try {
    const { status } = req.query;

    let rows;

    if (status === undefined) {
      rows = await sql`
        SELECT 
          a.name,
          a.mobile_number,
          a.aadhar_number,
          a.pan_number,
          b.account_number,
          b.account_type,
          b.status
        FROM users a
        JOIN accounts b ON a.id = b.user_id
        ORDER BY b.account_number ASC;
      `;
    } else {
      rows = await sql`
        SELECT 
          a.name,
          a.mobile_number,
          a.aadhar_number,
          a.pan_number,
          b.account_number,
          b.account_type,
          b.status
        FROM users a
        JOIN accounts b ON a.id = b.user_id
        WHERE b.status = ${status}
        ORDER BY b.account_number ASC;
      `;
    }

    return res.status(200).json({
      status: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const chnageAccountStatus = async (req, res) => {
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
export const getFullUserProfile = async (req, res) => {
  try {
    const { account_number } = req.query;

    if (!account_number) {
      return res.status(400).json({
        status: false,
        message: "Account number is required",
      });
    }

    /* ---------------- USER + ACCOUNT ---------------- */
    const userResult = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.mobile_number,
        u.address,
        u.created_at,
        a.id,
        a.account_number,
        a.account_type,
        a.balance,
        a.status AS account_status
      FROM users u
      JOIN accounts a ON a.user_id = u.id
      WHERE a.account_number = ${account_number}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const user = userResult[0];
    const user_id = user.user_id;

    /* ---------------- KYC ---------------- */
    const kyc = await sql`
      SELECT *
      FROM kyc
      WHERE customer_id = ${user_id}
    `;

    const kycDocuments = kyc.length
      ? await sql`
          SELECT *
          FROM kyc_documents
          WHERE kyc_id = ${kyc[0].kyc_id}
        `
      : [];

    /* ---------------- LOANS ---------------- */
    const loans = await sql`
      SELECT *
      FROM loans
      WHERE user_id = ${user_id}
    `;

    const loanPayments = await sql`
      SELECT lp.*
      FROM loan_payments lp
      JOIN loans l ON l.id = lp.loan_id
      WHERE l.user_id = ${user_id}
    `;

    /* ---------------- CARDS ---------------- */
    const cards = await sql`
      SELECT *
      FROM cards
      WHERE customer_id = ${user_id}
    `;

    // const cardPayments = await sql`
    //   SELECT cp.*
    //   FROM card_transactions cp
    //   JOIN cards c ON c.id = cp.card_id
    //   WHERE c.customer_id = ${user_id}
    // `;

    /* ---------------- TRANSACTIONS ---------------- */
    const transactions = await sql`
      SELECT *
      FROM transactions
      WHERE from_account = ${account_number}
         OR to_account = ${account_number}
      ORDER BY created_at DESC
    `;

    /* ---------------- FINAL RESPONSE ---------------- */
    res.status(200).json({
      status: true,
      data: {
        personal_details: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          mobile_number: user.mobile_number,
          address: user.address,
          joined_on: user.created_at,
        },
        account: {
          account_id: user.account_id,
          account_number: user.account_number,
          account_type: user.account_type,
          balance: user.balance,
          status: user.account_status,
        },
        kyc: kyc[0] || null,
        kyc_documents: kycDocuments,
        loans,
        loan_payments: loanPayments,
        cards,
        // card_payments: cardPayments,
        transactions,
      },
    });
  } catch (err) {
    console.error("User Profile Error:", err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch user profile",
    });
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
    console.log(accountNumber);

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

    // Insert transaction record
    await sql`
      INSERT INTO transactions
        (account_number, transaction_type, amount, currency, from_account, to_account, description, status, initiated_by_staff)
      VALUES
        (${accountNumber}, ${type}, ${amount}, 'INR', 'BANK', ${accountNumber}, 'Bank initiated transaction', 'success', ${req.id})
    `;

    res.json({ status: true, balance: updated[0].balance });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

