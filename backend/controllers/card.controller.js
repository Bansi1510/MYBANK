import sql from "../utils/db.js"


export const requestDebitCard = async (req, res) => {
  try {
    const userId = req.id;
    const { account_number, card_type, card_brand, card_variant } = req.body;

    if (!account_number || !card_type || !card_brand || !card_variant) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    /* 1️⃣ Check account belongs to user */
    const account = await sql`
      SELECT account_number 
      FROM accounts 
      WHERE account_number = ${account_number}
      AND customer_id = ${userId}
    `;

    if (account.length === 0) {
      return res.status(403).json({
        status: false,
        message: "Invalid account number",
      });
    }

    /* 2️⃣ Check existing pending request */
    const existingReq = await sql`
      SELECT 1 FROM card_requests 
      WHERE customer_id = ${userId}
      AND request_status = 'pending'
    `;

    if (existingReq.length > 0) {
      return res.status(409).json({
        status: false,
        message: "You already have a pending card request",
      });
    }

    /* 3️⃣ Insert request */
    await sql`
      INSERT INTO card_requests (
        customer_id,
        account_number,
        card_type,
        card_brand,
        card_variant
      )
      VALUES (
        ${userId},
        ${account_number},
        ${card_type},
        ${card_brand},
        ${card_variant}
      )
    `;

    return res.status(201).json({
      status: true,
      message: "Card request submitted successfully",
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
  try {
    const cardRequests = await sql`
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
      WHERE request_status = 'pending'
      ORDER BY requested_at DESC
    `;

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

export const updateLoanStatus = async (req, res) => {
  try {

  } catch (error) {
    console.error("Get Card Requests Error:", error);
    return res.status(500).json({
      status: false,
      message: "Unable to fetch card requests",
    });
  }
}