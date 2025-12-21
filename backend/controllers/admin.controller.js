import bcrypt from "bcryptjs";
import sql from "../utils/db.js";




const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export const addStaff = async (req, res) => {
  try {
    const { name, email, mobile_number, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8–12 characters and include uppercase, lowercase, number and special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await sql`
      INSERT INTO staff_admins (name, email, mobile_number, password, role)
      VALUES (${name}, ${email}, ${mobile_number}, ${hashedPassword}, ${role})
      RETURNING id, name, email, mobile_number, role
    `;

    res.status(201).json({
      status: true,
      message: "Staff added successfully",
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.message,
    });
  }
};


// 2) UPDATE STAFF
export const updateStaff = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { name, mobile_number, role } = req.body;

    const updated = await sql`
      UPDATE staff_admins
      SET name=${name}, mobile_number=${mobile_number}, role=${role}
      WHERE id=${staff_id}
      RETURNING id, name, email, mobile_number, role
    `;

    if (updated.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: "Staff updated successfully",
      staff: updated[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3) DELETE STAFF
export const deleteStaff = async (req, res) => {
  try {
    const { staff_id } = req.params;

    const deleted = await sql`
      DELETE FROM staff_admins
      WHERE id=${staff_id}
      RETURNING id
    `;

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: "Staff deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4) GET ALL STAFF
export const getAllStaff = async (req, res) => {
  try {
    const staffList = await sql`
      SELECT id, name, email, mobile_number, role, created_at
      FROM staff_admins WHERE role='staff'
      ORDER BY id DESC
    `;

    res.json({
      message: "All staff fetched successfully",
      staff: staffList,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getAllAccountRequests = async (req, res) => {
  try {
    const { status } = req.query;

    let query;
    if (status) {
      query = sql`
        SELECT * FROM account_requests
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else {
      query = sql`
        SELECT * FROM account_requests
        ORDER BY created_at DESC
      `;
    }

    const rows = await query;

    return res.status(200).json({
      status: true,
      message: "Account requests fetched successfully",
      data: rows
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message
    });
  }
};