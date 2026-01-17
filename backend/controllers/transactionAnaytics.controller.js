import sql from "../utils/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        id,
        from_account,
        to_account,
        amount,
        transaction_type,
        created_at
      FROM transactions
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
};

/* ========================================================
2️⃣ Account-to-Account Transfers
========================================================= */
export const getAccountTransfers = async (req, res) => {
  try {
    const result = await sql`
      SELECT *
      FROM transactions
      WHERE transaction_type = 'TRANSFER'
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch transfers" });
  }
};

/* ========================================================
3️⃣ Cash Deposit
========================================================= */
export const getCashDeposits = async (req, res) => {
  try {
    const result = await sql`
      SELECT *
      FROM transactions
      WHERE transaction_type = 'DEPOSIT'
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch deposits" });
  }
};

/* ========================================================
4️⃣ Cash Withdrawal
========================================================= */
export const getCashWithdraws = async (req, res) => {
  try {
    const result = await sql`
      SELECT *
      FROM transactions
      WHERE transaction_type = 'WITHDRAW'
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch withdrawals" });
  }
};