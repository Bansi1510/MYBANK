import sql from "../utils/db.js";



export const getUserProfile = async (req, res) => {
  const userId = req.id;

  try {
    const result = await sql`
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        u.mobile_number,
        u.address,
         a.id AS account_id,
        a.account_number,
        a.account_type,
        a.balance,
        a.status AS account_status
       FROM users u
      LEFT JOIN accounts a ON a.user_id = u.id
      WHERE u.id = ${userId}
    `;

    if (!result || result.length === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const user = {
      id: result[0].user_id,
      name: result[0].name,
      email: result[0].email,
      mobile_number: result[0].mobile_number,
      address: result[0].address,
      kyc_verified: result[0].kyc_verified,
      kyc_method: result[0].kyc_method,
      kyc_document_url: result[0].kyc_document_url,
      created_at: result[0].user_created_at,
      accounts: result.map(acc => acc.account_id ? {
        id: acc.account_id,
        account_number: acc.account_number,
        account_type: acc.account_type,
        balance: Number(acc.balance),
        status: acc.account_status,
        created_at: acc.account_created_at
      } : null).filter(Boolean)
    };

    res.json({ status: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.id;
  const { name, email, mobile_number, address } = req.body;

  const updatedUser = await sql`
    UPDATE users
    SET
      name = COALESCE(${name}, name),
      email = COALESCE(${email}, email),
      mobile_number = COALESCE(${mobile_number}, mobile_number),
      address = COALESCE(${address}, address)
    WHERE id = ${userId}
    RETURNING id, name, email, mobile_number, address
  `;

  res.json({ status: true, data: updatedUser[0] });
};
export const getUserAccounts = async (req, res) => {
  const userId = req.id;

  const accounts = await sql`
    SELECT id, account_number, account_type, balance, status, created_at
    FROM accounts
    WHERE user_id = ${userId}
  `;

  res.json({ status: true, account: accounts[0] });
};
export const getUserTransactions = async (req, res) => {
  const userId = req.id;

  const transactions = await sql`
    SELECT t.*
    FROM transactions t
    JOIN accounts a ON t.account_number = a.account_number
    WHERE a.user_id = ${userId}
    ORDER BY t.created_at DESC
    LIMIT 100
  `;

  res.json({ status: true, transactions });
};

