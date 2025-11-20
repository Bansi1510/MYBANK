import sql from "../utils/db.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});



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

export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ status: false, message: error.message });

  const { email, password } = req.body;

  const user = await sql.oneOrNone("SELECT * FROM users WHERE email=$1", [email]);
  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ status: false, message: "Invalid password" });

  const accessToken = generateAccessToken({ id: user.id, role: "user" });
  const refreshToken = generateRefreshToken({ id: user.id, role: "user" });

  return res.json({ status: true, accessToken, refreshToken });
};

export const loginStaff = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ status: false, message: error.message });

    const { email, password } = req.body;

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



export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ status: false, message: "Email required" });

  const user =
    (await sql.oneOrNone("SELECT * FROM users WHERE email=$1", [email])) ||
    (await sql.oneOrNone("SELECT * FROM staff_admins WHERE email=$1", [email]));

  if (!user) return res.status(404).json({ status: false, message: "Account not found" });

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHmac("sha256", process.env.OTP_SECRET).update(otp).digest("hex");

  await sql.none(
    "UPDATE users SET otp=$1 WHERE email=$2",
    [hashedOtp, email]
  ).catch(async () => {
    await sql.none("UPDATE staff_admins SET otp=$1 WHERE email=$2", [hashedOtp, email]);
  });

  await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

  return res.json({ status: true, message: "OTP sent successfully" });
};

export const verifyOTP = async (req, res) => {
  const { error } = otpSchema.validate(req.body);
  if (error) return res.status(400).json({ status: false, message: error.message });

  const { email, otp } = req.body;
  const hashedOtp = crypto.createHmac("sha256", process.env.OTP_SECRET).update(otp).digest("hex");

  const user =
    (await sql.oneOrNone("SELECT id,otp FROM users WHERE email=$1", [email])) ||
    (await sql.oneOrNone("SELECT id,otp FROM staff_admins WHERE email=$1", [email]));

  if (!user) return res.status(404).json({ status: false, message: "Account not found" });
  if (user.otp !== hashedOtp) return res.status(400).json({ status: false, message: "Invalid OTP" });

  await sql.none(
    "UPDATE users SET otp=NULL WHERE email=$1",
    [email]
  ).catch(async () => {
    await sql.none("UPDATE staff_admins SET otp=NULL WHERE email=$1", [email]);
  });

  return res.json({ status: true, message: "OTP verified successfully" });
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ status: false, message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });
    return res.json({ status: true, accessToken });
  } catch {
    return res.status(403).json({ status: false, message: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  return res.json({ status: true, message: "Logged out successfully" });
};
