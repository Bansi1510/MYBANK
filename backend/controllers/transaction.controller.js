import sql from "../utils/db.js";

export const transfer = async (req, res) => {
  const userId = req.id;
  const { toAccount, amount, description } = req.body;

  try {
    await sql`BEGIN`;

    const sender = await sql`
      SELECT * FROM accounts
      WHERE user_id = ${userId}
    `;

    if (!sender.length) {
      await sql`ROLLBACK`;
      return res.status(404).json({ status: false, message: "Sender account not found" });
    }

    const senderAcc = sender[0];

    if (senderAcc.status !== "active") {
      await sql`ROLLBACK`;
      return res.status(400).json({ status: false, message: "Sender account not active" });
    }

    const receiver = await sql`
      SELECT * FROM accounts
      WHERE account_number = ${toAccount}
    `;

    if (!receiver.length) {
      await sql`ROLLBACK`;
      return res.status(404).json({ status: false, message: "Receiver account not found" });
    }

    const receiverAcc = receiver[0];

    if (receiverAcc.status !== "active") {
      await sql`ROLLBACK`;
      return res.status(400).json({ status: false, message: "Receiver account not active" });
    }

    if (Number(senderAcc.balance) < Number(amount)) {
      await sql`ROLLBACK`;
      return res.status(400).json({ status: false, message: "Insufficient balance" });
    }

    const newSenderBalance = Number(senderAcc.balance) - Number(amount);
    const newReceiverBalance = Number(receiverAcc.balance) + Number(amount);

    await sql`
      UPDATE accounts
      SET balance = ${newSenderBalance}
      WHERE account_number = ${senderAcc.account_number}
    `;

    await sql`
      UPDATE accounts
      SET balance = ${newReceiverBalance}
      WHERE account_number = ${receiverAcc.account_number}
    `;

    await sql`
      INSERT INTO transactions
        (account_number, transaction_type, amount, currency, from_account, to_account, description, status, initiated_by_user)
      VALUES
        (${senderAcc.account_number}, 'transfer', ${amount}, 'INR', ${senderAcc.account_number}, ${receiverAcc.account_number}, ${description}, 'success', ${userId})
    `;

    await sql`COMMIT`;

    res.json({
      status: true,
      message: "Transfer successful",
      sender_balance: newSenderBalance,
    });
  } catch (err) {
    await sql`ROLLBACK`;
    res.status(500).json({ status: false, error: err.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const acc = await sql`
      SELECT account_number FROM accounts
      WHERE user_id = ${userId}
    `;

    if (!acc.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE account_number = ${acc[0].account_number}
      ORDERORDER BY created_at DESC
    `;

    res.json({ status: true, transactions });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const getTransactionSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const acc = await sql`
      SELECT account_number FROM accounts
      WHERE user_id = ${userId}
    `;

    if (!acc.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    const accountNumber = acc[0].account_number;

    const income = await sql`
      SELECT COALESCE(SUM(amount),0) AS income
      FROM transactions
      WHERE to_account = ${accountNumber}
    `;

    const expense = await sql`
      SELECT COALESCE(SUM(amount),0) AS expense
      FROM transactions
      WHERE from_account = ${accountNumber}
    `;

    res.json({
      status: true,
      summary: {
        income: income[0].income,
        expense: expense[0].expense,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const downloadStatement = async (req, res) => {
  const userId = req.user.id;

  try {
    const acc = await sql`
      SELECT account_number FROM accounts
      WHERE user_id = ${userId}
    `;

    if (!acc.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }

    const accountNumber = acc[0].account_number;

    const tx = await sql`
      SELECT * FROM transactions
      WHERE account_number = ${accountNumber}
      ORDER BY created_at DESC
    `;

    res.json({
      status: true,
      statement: tx,
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
