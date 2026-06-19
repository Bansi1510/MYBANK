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
    console.log(accessToken)
    res.cookie("access_token", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
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
export const refreshToken = async (req, res) => {
  try {
    console.log("hello");
    console.log(req.cookies.refresh_token);
    const cookieToken = req.cookies.refresh_token || req.cookies.refreshToken || req.cookies.refresh_token;
    const bodyToken = req.body && req.body.token;
    const token = cookieToken || bodyToken;

    if (!token) return res.status(401).json({ status: false, message: "Refresh token required" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ status: false, message: "Invalid refresh token" });
    }
    console.log(decoded);
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
