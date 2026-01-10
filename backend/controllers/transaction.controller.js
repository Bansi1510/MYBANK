import sql from "../utils/db.js";
import PDFDocument from "pdfkit";


export const transferViaAcc = async (req, res) => {
  const userId = req.id;
  const { toAccount, amount, description } = req.body;

  try {
    await sql`BEGIN`;

    const sender = await sql`
      SELECT a.*, u.name
      FROM accounts a
      JOIN users u ON u.id = a.user_id
      WHERE a.user_id = ${userId}
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
      SELECT a.*, u.name, u.mobile_number
      FROM accounts a
      JOIN users u ON u.id = a.user_id
      WHERE a.account_number = ${toAccount}
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

    const transaction = await sql`
      INSERT INTO transactions
        (account_number, transaction_type, amount, currency, from_account, to_account, description, status, initiated_by_user)
      VALUES
        (${senderAcc.account_number}, 'transfer', ${amount}, 'INR', ${senderAcc.account_number}, ${receiverAcc.account_number}, ${description}, 'success', ${userId})
      RETURNING id, created_at
    `;

    const txn = transaction[0];

    await sql`COMMIT`;


    return res.json({
      status: true,
      message: "Transfer successful",
      transaction: {
        transaction_id: txn.id,
        timestamp: txn.created_at,
        amount: amount,
        currency: "INR",
        note: description || null,

        sender: {
          account_number: senderAcc.account_number,
          name: senderAcc.name || "You",
          balance_after: newSenderBalance,
        },

        receiver: {
          account_number: receiverAcc.account_number,
          name: receiverAcc.name,
          mobile: receiverAcc.mobile_number,
        },
      },
    });

  } catch (err) {
    await sql`ROLLBACK`;
    return res.status(500).json({ status: false, error: err.message });
  }
};


export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.id;
    const { start_date, end_date } = req.query;


    const acc = await sql`
      SELECT account_number
      FROM accounts
      WHERE user_id = ${userId}
    `;

    if (!acc.length) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    const accountNumber = acc[0].account_number;
    let transactions;


    if (start_date && end_date) {
      transactions = await sql`
        SELECT *
        FROM transactions
        WHERE account_number = ${accountNumber}
        AND created_at BETWEEN ${start_date} AND ${end_date}
        ORDER BY created_at DESC
      `;
    }

    else if (start_date) {
      transactions = await sql`
        SELECT *
        FROM transactions
        WHERE account_number = ${accountNumber}
        AND created_at >= ${start_date}
        ORDER BY created_at DESC
      `;
    }

    else {
      transactions = await sql`
        SELECT *
        FROM transactions
        WHERE account_number = ${accountNumber}
        ORDER BY created_at DESC
      `;
    }

    return res.json({
      status: true,
      count: transactions.length,
      transactions,
    });

  } catch (error) {
    console.error("Transaction history error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch transactions",
    });
  }
};

export const getTransactionsForStaff = async (req, res) => {
  try {
    const { account_number, start_date, end_date } = req.query;

    if (!account_number) {
      return res
        .status(400)
        .json({ status: false, message: "account_number is required" });
    }

    let transactions;

    if (start_date && end_date) {
      transactions = await sql`
        SELECT *
        FROM transactions
        WHERE (from_account = ${account_number}
           OR to_account = ${account_number})
        AND created_at BETWEEN ${start_date} AND ${end_date}
        ORDER BY created_at DESC
      `;
    } else if (start_date) {
      transactions = await sql`
        SELECT *
        FROM transactions
        WHERE (from_account = ${account_number}
           OR to_account = ${account_number})
        AND created_at >= ${start_date}
        ORDER BY created_at DESC
      `;
    } else {
      transactions = await sql`
        SELECT *
        FROM transactions
        WHERE (from_account = ${account_number}
           OR to_account = ${account_number})
        ORDER BY created_at DESC
      `;
    }

    res.json({
      status: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};


export const transactionByStaff = async (req, res) => {
  const staffId = req.id;
  const { from_account, to_account, amount, description } = req.body;

  if (!from_account || !to_account || !amount) {
    return res.status(400).json({
      status: false,
      message: "from_account, to_account and amount required",
    });
  }

  if (from_account === to_account) {
    return res.status(400).json({
      status: false,
      message: "Sender and receiver cannot be same",
    });
  }

  try {
    // Start transaction
    await sql`
      BEGIN
    `;

    // Lock sender row
    const sender = await sql`
      SELECT balance FROM accounts
      WHERE account_number = ${from_account}
      FOR UPDATE
    `;

    if (!sender.length) throw new Error("Sender account not found");
    if (sender[0].balance < amount) throw new Error("Insufficient balance");

    // Lock receiver row
    const receiver = await sql`
      SELECT balance FROM accounts
      WHERE account_number = ${to_account}
      FOR UPDATE
    `;

    if (!receiver.length) throw new Error("Receiver account not found");

    // Deduct from sender
    await sql`
      UPDATE accounts
      SET balance = balance - ${amount}
      WHERE account_number = ${from_account}
    `;

    // Add to receiver
    await sql`
      UPDATE accounts
      SET balance = balance + ${amount}
      WHERE account_number = ${to_account}
    `;

    // Record transaction
    await sql`
      INSERT INTO transactions (
        account_number,
        transaction_type,
        amount,
        from_account,
        to_account,
        description,
        initiated_by_staff
      )
      VALUES (
        ${from_account},
        'transfer',
        ${amount},
        ${from_account},
        ${to_account},
        ${description},
        ${staffId}
      )
    `;

    // Commit transaction
    await sql`
      COMMIT
    `;

    return res.status(201).json({
      status: true,
      message: "Transfer transaction recorded",
    });
  } catch (error) {
    // Rollback on error
    await sql`ROLLBACK`;

    console.error("Neon transfer error:", error.message || error);
    return res.status(500).json({
      status: false,
      message: error.message || "Transfer failed",
    });
  }
};

export const cashTransactionByStaff = async (req, res) => {
  const staffId = req.id;

  const {
    account_number,
    amount,
    transaction_type,
    description,
  } = req.body;

  if (!account_number || !amount || !transaction_type) {
    return res.status(400).json({
      status: false,
      message: "account_number, amount and transaction_type required",
    });
  }

  if (!["deposit", "withdraw"].includes(transaction_type)) {
    return res.status(400).json({
      status: false,
      message: "transaction_type must be deposit or withdraw",
    });
  }

  try {
    /* START NEON TRANSACTION */
    await sql`BEGIN`;

    /* LOCK ACCOUNT */
    const account = await sql`
      SELECT balance
      FROM accounts
      WHERE account_number = ${account_number}
      FOR UPDATE
    `;

    if (!account.length) {
      throw new Error("Account not found");
    }

    const currentBalance = Number(account[0].balance);
    const txnAmount = Number(amount);

    if (transaction_type === "withdraw" && currentBalance < txnAmount) {
      throw new Error("Insufficient balance");
    }

    /* CALCULATE NEW BALANCE */
    const newBalance =
      transaction_type === "deposit"
        ? currentBalance + txnAmount
        : currentBalance - txnAmount;

    /* UPDATE ACCOUNT BALANCE */
    await sql`
      UPDATE accounts
      SET balance = ${newBalance}
      WHERE account_number = ${account_number}
    `;

    /* INSERT TRANSACTION RECORD */
    await sql`
      INSERT INTO transactions (
        account_number,
        transaction_type,
        amount,
        currency,
        from_account,
        to_account,
        description,
        status,
        initiated_by_staff
      )
      VALUES (
        ${account_number},
        ${transaction_type},
        ${txnAmount},
        'INR',
        ${transaction_type === "withdraw" ? account_number : null},
        ${transaction_type === "deposit" ? account_number : null},
        ${description},
        'success',
        ${staffId}
      )
    `;

    /* COMMIT */
    await sql`COMMIT`;

    return res.status(201).json({
      status: true,
      message: `Cash ${transaction_type} successful`,
    });

  } catch (error) {
    await sql`ROLLBACK`;

    console.error("Neon cash error:", error.message || error);
    return res.status(500).json({
      status: false,
      message: error.message || "Cash transaction failed",
    });
  }
};

export const getTransactionsByAccount = async (req, res) => {
  try {
    const { account_number, start_date, end_date } = req.query;

    if (!account_number) {
      return res.status(400).json({
        status: false,
        message: "account_number is required",
      });
    }

    let query;

    if (start_date && end_date) {
      query = sql`
        SELECT *
        FROM transactions
        WHERE account_number = ${account_number}
          AND created_at BETWEEN ${start_date} AND ${end_date}
        ORDER BY created_at DESC
      `;
    }

    else if (start_date && !end_date) {
      query = sql`
        SELECT *
        FROM transactions
        WHERE account_number = ${account_number}
          AND created_at >= ${start_date}
        ORDER BY created_at DESC
      `;
    }

    else {
      query = sql`
        SELECT *
        FROM transactions
        WHERE account_number = ${account_number}
        ORDER BY created_at DESC
      `;
    }

    const transactions = await query;

    return res.status(200).json({
      status: true,
      count: transactions.length,
      data: transactions,
    });

  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch transactions",
    });
  }
};

export const downloadStatement = async (req, res) => {
  const userId = req.id;
  const { start_date, end_date } = req.query;

  try {
    const userRes = await sql`
      SELECT id, name, email, mobile_number, address 
      FROM users 
      WHERE id = ${userId}
    `;
    if (!userRes.length) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const user = userRes[0];
    console.log(user)
    const accRes = await sql`
      SELECT account_number, account_type, balance 
      FROM accounts 
      WHERE user_id = ${userId}
    `;
    if (!accRes.length) {
      return res.status(404).json({ status: false, message: "Account not found" });
    }
    const account = accRes[0];
    const accountNumber = account.account_number;

    const finalend_date = end_date || new Date().toISOString().slice(0, 10);

    let tx;
    if (start_date) {
      tx = await sql`
        SELECT t.*, 
          ua.name AS user_name_from, 
          ub.name AS user_name_to 
        FROM transactions t 
          LEFT JOIN users ua ON ua.id = (SELECT user_id FROM accounts WHERE account_number = t.from_account)
          LEFT JOIN users ub ON ub.id = (SELECT user_id FROM accounts WHERE account_number = t.to_account)
        WHERE t.account_number = ${accountNumber}
          AND t.created_at BETWEEN ${start_date} AND ${finalend_date}
        ORDER BY t.created_at DESC
      `;
    } else {
      tx = await sql`
        SELECT t.*, 
          ua.name AS user_name_from, 
          ub.name AS user_name_to 
        FROM transactions t 
          LEFT JOIN users ua ON ua.id = (SELECT user_id FROM accounts WHERE account_number = t.from_account)
          LEFT JOIN users ub ON ub.id = (SELECT user_id FROM accounts WHERE account_number = t.to_account)
        WHERE t.account_number = ${accountNumber}
        ORDER BY t.created_at DESC
      `;
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=statement.pdf");
    doc.pipe(res);

    doc.fontSize(22).text("MYBANK — Account Statement", { align: "center" });
    doc.moveDown();

    doc.fontSize(11);
    doc.text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.mobile_number}`);
    doc.text(`Address: ${user.address}`);
    doc.text(`Account Number: ${account.account_number}`);
    doc.text(`Account Type: ${account.account_type}`);
    doc.text(`Current Balance: ${account.balance}`);
    doc.moveDown();
    doc.text(`Statement Period: ${start_date ? start_date : "FULL"} → ${finalend_date}`);
    doc.moveDown();

    doc.fontSize(12).text("Transactions:", { underline: true });
    doc.moveDown(0.5);

    const cols = { date: 40, type: 170, amount: 240, from: 320, to: 470 };
    const colWidth = { date: 120, type: 60, amount: 70, from: 140, to: 140 };

    doc.fontSize(10);
    const headerY = doc.y;
    doc.text("Date", cols.date, headerY, { width: colWidth.date });
    doc.text("Type", cols.type, headerY, { width: colWidth.type });
    doc.text("Amount", cols.amount, headerY, { width: colWidth.amount });
    doc.text("From", cols.from, headerY, { width: colWidth.from });
    doc.text("To", cols.to, headerY, { width: colWidth.to });

    doc.moveDown(0.7);
    let rowY = doc.y;

    tx.forEach((t) => {
      const readableType =
        t.transaction_type === "withdraw"
          ? "Debit"
          : t.transaction_type === "deposit"
            ? "Credit"
            : t.transaction_type;

      const fromText = t.from_account
        ? `${t.user_name_from || "Unknown"}\n${t.from_account}`
        : "BANK / SYSTEM";
      const toText = t.to_account
        ? `${t.user_name_to || "Unknown"}\n${t.to_account}`
        : "-";

      const date = t.created_at
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const fromLines = Math.ceil(doc.heightOfString(fromText, { width: colWidth.from }) / 10);
      const toLines = Math.ceil(doc.heightOfString(toText, { width: colWidth.to }) / 10);
      const maxLines = Math.max(1, fromLines, toLines);
      const rowHeight = maxLines * 12;

      doc.fontSize(9);
      doc.text(date, cols.date, rowY, { width: colWidth.date });
      doc.text(readableType, cols.type, rowY, { width: colWidth.type });
      doc.text(`₹${t.amount}`, cols.amount, rowY, { width: colWidth.amount });
      doc.text(fromText, cols.from, rowY, { width: colWidth.from });
      doc.text(toText, cols.to, rowY, { width: colWidth.to });

      rowY += rowHeight + 5;
      doc.moveTo(cols.date, rowY - 3)
        .lineTo(550, rowY - 3)
        .strokeColor("#cccccc")
        .stroke();
    });

    doc.y = rowY + 10;
    doc.end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};
export const transferViaMobile = async (req, res) => {
  try {
    const { senderAccountNumber, recipientMobile, amount, note } = req.body;

    if (!senderAccountNumber || !recipientMobile || !amount) {
      return res.status(400).json({ status: false, message: "Missing fields" });
    }

    const sender = await sql`
      SELECT * FROM accounts
      WHERE account_number = ${senderAccountNumber}
      AND status = 'active'
    `;

    if (!sender.length)
      return res.status(404).json({ status: false, message: "Sender account not found" });

    if (Number(sender[0].balance) < amount)
      return res.status(400).json({ status: false, message: "Insufficient balance" });

    const recipient = await sql`
      SELECT a.*, u.mobile_number, u.name
      FROM accounts a
      JOIN users u ON u.id = a.user_id
      WHERE u.mobile_number = ${recipientMobile}
      AND a.status = 'active'
      LIMIT 1
    `;

    if (!recipient.length)
      return res.status(404).json({ status: false, message: "Recipient not found" });

    const receiverAcc = recipient[0];

    await sql`BEGIN`;

    let transactionRow;

    try {
      const updatedSender = await sql`
        UPDATE accounts
        SET balance = balance - ${amount}
        WHERE account_number = ${senderAccountNumber}
          AND balance >= ${amount}
        RETURNING id
      `;

      if (!updatedSender.length) throw new Error("Insufficient balance");

      await sql`
        UPDATE accounts
        SET balance = balance + ${amount}
        WHERE id = ${receiverAcc.id}
      `;

      transactionRow = await sql`
        INSERT INTO transactions (
          account_number,
          transaction_type,
          amount,
          currency,
          from_account,
          to_account,
          description,
          status,
          initiated_by_user
        )
        VALUES (
          ${senderAccountNumber},
          'upi',
          ${amount},
          'INR',
          ${senderAccountNumber},
          ${receiverAcc.account_number},
          ${note || `Money sent to ${recipientMobile}`},
          'success',
          ${req.id}
        )
        RETURNING id, created_at
      `;

      await sql`COMMIT`;
    } catch (txnErr) {
      await sql`ROLLBACK`;
      throw txnErr;
    }

    return res.status(200).json({
      status: true,
      message: "Money sent successfully via Mobile",
      transaction: {
        transaction_id: transactionRow[0].id,
        timestamp: transactionRow[0].created_at,

        amount,
        currency: "INR",
        note: note || null,

        sender: {
          account_number: sender[0].account_number,
          name: sender[0].account_holder || "You"
        },

        receiver: {
          account_number: receiverAcc.account_number,
          mobile: receiverAcc.mobile_number,
          name: receiverAcc.name
        }
      }
    });

  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};
