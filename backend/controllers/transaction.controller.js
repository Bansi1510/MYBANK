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
  const userId = req.id;
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
      ORDER BY created_at DESC
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
  const userId = req.id;
  const { startDate, endDate } = req.query;
  console.log("hello", userId);

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

    const finalEndDate = endDate || new Date().toISOString().slice(0, 10);

    let tx;
    if (startDate) {
      tx = await sql`
        SELECT t.*, 
          ua.name AS user_name_from, 
          ub.name AS user_name_to 
        FROM transactions t 
          LEFT JOIN users ua ON ua.id = (SELECT user_id FROM accounts WHERE account_number = t.from_account)
          LEFT JOIN users ub ON ub.id = (SELECT user_id FROM accounts WHERE account_number = t.to_account)
        WHERE t.account_number = ${accountNumber}
          AND t.created_at BETWEEN ${startDate} AND ${finalEndDate}
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
    doc.text(`Statement Period: ${startDate ? startDate : "FULL"} → ${finalEndDate}`);
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









