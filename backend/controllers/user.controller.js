import bcrypt from "bcrypt";
import validator from "validator";
import sql from "../utils/db.js"

export const signup = async (req, res) => {
  const { name, email, password, role, address, kyc_verified } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required",
      success: false
    });
  }

  try {
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
        success: false
      });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 chars and include uppercase, lowercase, number, and symbol",
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "customer";
    const userAddress = address || null;

    const [newUser] = await sql`
      INSERT INTO users (name, email, password_hash, role, address, kyc_verified)
      VALUES (${name}, ${email}, ${hashedPassword}, ${userRole}, ${userAddress}, COALESCE(${kyc_verified}, FALSE))
      RETURNING id, name, email, role, address, kyc_verified, created_at;
    `;

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
