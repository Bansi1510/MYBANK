import sql from "../utils/db.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, hashOTP, sendWhatsappOTP } from "../utils/otp.js";


const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};



export const addAdmin = async (req, res) => {
  try {

    const { name, email, mobile_number, password } = req.body;

    if (!name || !email || !mobile_number || !password) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: false, message: "Invalid email format" });
    }

    const strongPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{4,}$/;
    if (!strongPass.test(password)) {
      return res.status(400).json({
        status: false,
        message: "Password must be strong (A-Z, a-z, number, symbol, min 4 chars)"
      });
    }

    const exists = await sql`
      SELECT id FROM staff_admins WHERE email=${email}
    `;

    if (exists.length > 0) {
      return res.status(409).json({ status: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await sql`
      INSERT INTO staff_admins (name, email, mobile_number, password, role, status)
      VALUES (${name}, ${email}, ${mobile_number}, ${hashedPassword}, 'admin', 'active')
      RETURNING id, name, email, mobile_number, role, status, created_at
    `;

    return res.status(201).json({
      status: true,
      message: "Admin created successfully",
      admin: newAdmin[0]
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};



export const loginStaff = async (req, res) => {
  try {


    const { email, password } = req.body;
    console.log("Hello")

    const rows = await sql`
      SELECT * FROM staff_admins 
      WHERE email=${email} AND role='staff'
    `;

    if (rows.length === 0)
      return res.status(404).json({ status: false, message: "Staff not found" });

    const staff = rows[0];

    const match = await bcrypt.compare(password, staff.password);
    if (!match)
      return res.status(401).json({ status: false, message: "Invalid password" });

    const accessToken = generateAccessToken({ id: staff.id, role: "staff" });
    const refreshToken = generateRefreshToken({ id: staff.id, role: "staff" });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      status: true,
      message: "Login successful",
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ status: false, message: "something is missing" });
    }

    const rows = await sql`
      SELECT * FROM staff_admins 
      WHERE email=${email} AND role='admin'
    `;

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ status: false, message: "Invalid password" });
    }

    const accessToken = generateAccessToken({ id: admin.id, role: "admin" });
    const refreshToken = generateRefreshToken({ id: admin.id, role: "admin" });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      status: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { account_number, password } = req.body;

    if (!account_number || !password)
      return res.status(400).json({ status: false, message: "Missing fields" });

    const account = await sql`
      SELECT * FROM accounts WHERE account_number = ${account_number}
    `;

    if (!account.length)
      return res.status(404).json({ status: false, message: "Account not found" });

    const user = await sql`
      SELECT * FROM users WHERE id = ${account[0].user_id}
    `;

    if (!user.length)
      return res.status(404).json({ status: false, message: "User not found" });

    const match = await bcrypt.compare(password, user[0].password);
    if (!match)
      return res.status(401).json({ status: false, message: "Wrong password" });

    // Step 1 success → request OTP
    return res.json({
      status: true,
      message: "Password correct. OTP required.",
      mobile_number: user[0].mobile_number,
      account_number
    });

  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { mobile_number, account_number } = req.body;
    if (!mobile_number)
      return res.status(400).json({ status: false, message: "Mobile number required" });

    const user = await sql`
  SELECT u.*, a.account_number
  FROM users u
  JOIN accounts a ON u.id = a.user_id
  WHERE u.mobile_number = ${mobile_number}
    AND a.account_number = ${account_number}
`;

    if (!user.length)
      return res.status(404).json({ status: false, message: "User not found" });

    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);

    await sql`
      UPDATE users SET otp = ${hashedOtp}
      WHERE mobile_number = ${mobile_number}
    `;


    await sendWhatsappOTP(mobile_number, otp);

    return res.json({ status: true, message: "OTP sent to WhatsApp" });

  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { mobile_number, otp, account_number } = req.body;

    if (!mobile_number || !otp || !account_number)
      return res.status(400).json({ status: false, message: "Missing fields" });

    // 1. Find user whose mobile number matches AND has the given account
    const user = await sql`
      SELECT u.id, u.otp
      FROM users u
      JOIN accounts a ON a.user_id = u.id
      WHERE u.mobile_number = ${mobile_number}
      AND a.account_number = ${account_number}
    `;

    if (!user.length)
      return res.status(404).json({
        status: false,
        message: "Mobile number & account number do not match"
      });

    // 2. Verify OTP
    const isValid = bcrypt.compareSync(otp, user[0].otp);
    if (!isValid)
      return res.status(400).json({ status: false, message: "Invalid OTP" });

    // 3. Clear OTP after success
    await sql`
      UPDATE users SET otp = NULL WHERE mobile_number = ${mobile_number}
    `;

    // 4. Generate tokens
    const accessToken = generateAccessToken({ id: user[0].id, role: "user" });
    const refreshToken = generateRefreshToken({ id: user[0].id, role: "user" });

    res.cookie("access_token", accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    // 5. Safe response
    return res.json({
      status: true,
      message: "OTP verified successfully",
      user_id: user[0].id
    });

  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


export const logout = async (req, res) => {
  try {
    console.log("hello backend");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    };

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);

    return res.json({ status: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: err.message });
  }
};


export const getFullUserProfile = async (req, res) => {
  try {
    const { account_number } = req.params;

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
        a.account_id,
        a.account_number,
        a.account_type,
        a.balance,
        a.status AS account_status
      FROM users u
      JOIN accounts a ON a.user_id = u.user_id
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

    const cardPayments = await sql`
      SELECT cp.*
      FROM card_transactions cp
      JOIN cards c ON c.id = cp.card_id
      WHERE c.customer_id = ${user_id}
    `;

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
          name: `${user.first_name} ${user.last_name}`,
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
        card_payments: cardPayments,
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

export const refreshToken = async (req, res) => {
  try {
    const cookieToken = req.cookies && (req.cookies.refresh_token || req.cookies.refreshToken || req.cookies.refresh_token);
    const bodyToken = req.body && req.body.token;
    const token = cookieToken || bodyToken;

    if (!token) return res.status(401).json({ status: false, message: "Refresh token required" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ status: false, message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

    // Optionally set cookie for new access token
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ status: true, accessToken });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
