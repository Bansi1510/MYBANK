import sql from "../utils/db.js"
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const requestDebitCard = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const role = req.role; // "customer" | "staff"

    const {
      account_number,
      card_type,
      card_brand,
      card_variant,
    } = req.body;

    if (!account_number || !card_type || !card_brand || !card_variant) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    let targetCustomerId;

    /* 1️⃣ Resolve customer_id */
    if (role === "customer") {
      targetCustomerId = loggedInUserId;
    } else {
      // Staff flow: get customer from account
      const account = await sql`
        SELECT user_id
        FROM accounts
        WHERE account_number = ${account_number}
      `;

      if (account.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Account not found",
        });
      }

      targetCustomerId = account[0].user_id;
    }

    /* 2️⃣ Check account belongs to customer */
    const accountCheck = await sql`
      SELECT 1
      FROM accounts
      WHERE account_number = ${account_number}
      AND user_id = ${targetCustomerId}
    `;

    if (accountCheck.length === 0) {
      return res.status(403).json({
        status: false,
        message: "Invalid account number",
      });
    }

    /* 3️⃣ Check existing pending request */
    const existingReq = await sql`
      SELECT 1
      FROM card_requests
      WHERE customer_id = ${targetCustomerId}
      AND request_status = 'pending'
    `;

    if (existingReq.length > 0) {
      return res.status(409).json({
        status: false,
        message: "A pending card request already exists",
      });
    }

    /* 4️⃣ Insert card request */
    await sql`
      INSERT INTO card_requests (
        customer_id,
        account_number,
        card_type,
        card_brand,
        card_variant,
        requested_by
      )
      VALUES (
        ${targetCustomerId},
        ${account_number},
        ${card_type},
        ${card_brand},
        ${card_variant},
        ${role}
      )
    `;

    return res.status(201).json({
      status: true,
      message:
        role === "staff"
          ? "Card request submitted by staff"
          : "Card request submitted successfully",
    });
  } catch (error) {
    console.error("Card Request Error:", error);
    return res.status(500).json({
      status: false,
      message: "Card request failed",
    });
  }
};



export const getNewCardReqs = async (req, res) => {
  const { status } = req.params;

  try {
    let cardRequests;

    if (status) {
      // 🔹 Filter by status
      cardRequests = await sql`
        SELECT 
          id,
          customer_id,
          account_number,
          card_type,
          card_brand,
          card_variant,
          request_status,
          requested_at
        FROM card_requests
        WHERE request_status = ${status}
        ORDER BY requested_at DESC
      `;
    } else {
      // 🔹 Fetch all requests
      cardRequests = await sql`
        SELECT 
          id,
          customer_id,
          account_number,
          card_type,
          card_brand,
          card_variant,
          request_status,
          requested_at
        FROM card_requests
        ORDER BY requested_at DESC
      `;
    }

    return res.status(200).json({
      status: true,
      card_requests: cardRequests,
    });

  } catch (error) {
    console.error("Get Card Requests Error:", error);
    return res.status(500).json({
      status: false,
      message: "Unable to fetch card requests",
    });
  }
};

const generateCardNumber = () => {
  let number = "";
  for (let i = 0; i < 16; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

const sendApprovalMail = async (email, name, card, fullCardNumber) => {
  const message = `
Dear ${name},

🎉 Congratulations! Your MYBANK card has been successfully issued.

📌 Card Details (PLEASE SAVE THIS EMAIL):
Card Number: ${fullCardNumber}
Expiry: ${card.expiry_month}/${card.expiry_year}
Card Type: ${card.card_type}
Card Brand: ${card.card_brand}
Card Variant: ${card.card_variant || "Standard"}

⚠️ IMPORTANT SECURITY NOTICE:
• This card number will NOT be shown again
• Do NOT share it with anyone
• MYBANK will never ask for your card details

Your card is currently inactive.
Please activate it from MYBANK services.

Regards,
MYBANK Card Services
`;

  await sendEmail(email, "Your MYBANK Card Details", message);
};

// Rejection email
const sendRejectionMail = async (email, name) => {
  const message = `
Dear ${name},

We regret to inform you that your card request has been rejected
after internal verification.

If you need more information, please contact MYBANK support.

Regards,
MYBANK Card Services
`;

  await sendEmail(email, "Card Request Update", message);
};

/* =====================================================
   MAIN CONTROLLER
===================================================== */

export const cardRequestAction = async (req, res) => {
  const role = req.role; // staff | admin
  const { card_req_id, action } = req.body; // approve | reject
  try {
    if (!card_req_id || !action) {
      return res.status(400).json({
        status: false,
        message: "card_req_id and action are required",
      });
    }

    /* 🔍 Fetch card request + user */
    const [cardReq] = await sql`
      SELECT 
        cr.*,
        u.email,
        u.name
      FROM card_requests cr
      JOIN users u ON u.id = cr.customer_id
      WHERE cr.id = ${card_req_id}
    `;

    if (!cardReq) {
      return res.status(404).json({
        status: false,
        message: "Card request not found",
      });
    }

    /* ===================== STAFF ===================== */
    if (role === "staff") {
      if (action === "approve") {
        await sql`
          UPDATE card_requests
          SET request_status = 'under_process'
          WHERE id = ${card_req_id}
        `;

        return res.status(200).json({
          status: true,
          message: "Card request moved to under process",
        });
      }

      if (action === "reject") {
        await sql`
          UPDATE card_requests
          SET request_status = 'rejected'
          WHERE id = ${card_req_id}
        `;

        await sendRejectionMail(cardReq.email, cardReq.full_name);

        return res.status(200).json({
          status: true,
          message: "Card request rejected by staff",
        });
      }
    }

    /* ===================== ADMIN ===================== */
    if (role === "admin") {
      if (action === "approve") {
        // 🔐 Generate card details (ONCE)
        const fullCardNumber = generateCardNumber(); // 12 digits
        const last4 = fullCardNumber.slice(-4);
        const cardToken = crypto.randomUUID();

        const expiryMonth = crypto.randomInt(1, 13);
        const expiryYear = new Date().getFullYear() + 5;

        /* ✅ ONE atomic Neon-safe query */
        const [card] = await sql`
          WITH issued_card AS (
            INSERT INTO cards (
              customer_id,
              account_number,
              card_token,
              last4,
              card_type,
              card_brand,
              card_variant,
              expiry_month,
              expiry_year,
              status
            )
            VALUES (
              ${cardReq.customer_id},
              ${cardReq.account_number},
              ${cardToken},
              ${last4},
              ${cardReq.card_type},
              ${cardReq.card_brand},
              ${cardReq.card_variant},
              ${expiryMonth},
              ${expiryYear},
              'inactive'
            )
            RETURNING *
          )
          DELETE FROM card_requests
          WHERE id = ${card_req_id}
          RETURNING (SELECT row_to_json(issued_card) FROM issued_card);
        `;

        // 📧 Send card details email (ONCE)
        await sendApprovalMail(
          cardReq.email,
          cardReq.full_name,
          card,
          fullCardNumber
        );

        return res.status(200).json({
          status: true,
          message: "Card approved and issued successfully",
        });
      }

      if (action === "reject") {
        await sql`
          UPDATE card_requests
          SET request_status = 'rejected'
          WHERE id = ${card_req_id}
        `;

        await sendRejectionMail(cardReq.email, cardReq.full_name);

        return res.status(200).json({
          status: true,
          message: "Card request rejected by admin",
        });
      }
    }

    return res.status(403).json({
      status: false,
      message: "Unauthorized role",
    });

  } catch (error) {
    console.error("Card Request Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getCardsSummary = async (req, res) => {
  const { status } = req.query;

  try {
    let cards;

    if (status) {
      // Filter by status
      cards = await sql`
    SELECT 
      c.account_number,
      c.last4,
      c.status,
      c.issued_at,
      c.expiry_month,
      c.expiry_year,
      u.name AS customer_name
    FROM cards c
    JOIN users u ON u.id = c.customer_id
    WHERE c.status = ${status}
    ORDER BY c.issued_at DESC
  `;
    } else {
      // No filter, get all
      cards = await sql`
    SELECT 
      c.account_number,
      c.last4,
      c.status,
      c.issued_at,
      c.expiry_month,
      c.expiry_year,
      u.name AS customer_name
    FROM cards c
    JOIN users u ON u.id = c.customer_id
    ORDER BY c.issued_at DESC
  `;
    }


    return res.status(200).json({
      status: true,
      cards,
    });

  } catch (error) {
    console.error("Get Cards Summary Error:", error);
    return res.status(500).json({
      status: false,
      message: "Unable to fetch cards summary",
    });
  }
};

export const getCardDetails = async (req, res) => {
  const { account_number } = req.params;

  if (!account_number) {
    return res.status(400).json({
      status: false,
      message: "account_number is required",
    });
  }

  try {
    const [card] = await sql`
      SELECT 
        c.*,
        u.name AS customer_name,
        u.email
      FROM cards c
      JOIN users u ON u.id = c.customer_id
      WHERE c.account_number = ${account_number}
    `;

    if (!card) {
      return res.status(404).json({
        status: false,
        message: "Card not found",
      });
    }

    return res.status(200).json({
      status: true,
      card,
    });

  } catch (error) {
    console.error("Get Card Details Error:", error);
    return res.status(500).json({
      status: false,
      message: "Unable to fetch card details",
    });
  }
};
