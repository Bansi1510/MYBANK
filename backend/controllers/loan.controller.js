import sql from "../utils/db.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendEmail from "../utils/sendEmail.js";

export const applyLoan = async (req, res) => {
  try {
    const user_id = req.id;
    console.log(req.role);
    const { loan_type, loan_amount, tenure } = req.body;

    if (!loan_type || !loan_amount || !tenure) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const allowedLoanTypes = [
      "home",
      "education",
      "personal",
      "vehicle",
      "gold",
      "property",
      "agriculture",
      "business",
    ];

    if (!allowedLoanTypes.includes(loan_type)) {
      return res.status(400).json({
        message: "Invalid loan type",
        success: false,
      });
    }

    const uploadedFiles = {};

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fieldName = file.fieldname;

        if (!uploadedFiles[fieldName]) {
          uploadedFiles[fieldName] = [];
        }

        const fileDataUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(
          fileDataUri.content,
          {
            folder: `MYBANK/loan_documents/${loan_type}`,
          }
        );

        uploadedFiles[fieldName].push({
          url: result.secure_url,
          public_id: result.public_id,
          file_type:
            file.mimetype === "application/pdf" ? "pdf" : "image",
        });
      }
    }

    const query = `
      INSERT INTO loan_req 
      (user_id, loan_type, loan_amount, tenure, documents)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      user_id,
      loan_type,
      loan_amount,
      tenure,
      Object.keys(uploadedFiles).length ? uploadedFiles : null,
    ];

    const result = await sql.query(query, values);

    res.status(201).json({
      message: "Loan request submitted successfully",
      success: true,
      loanRequest: result[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const getLoanReq = async (req, res) => {
  try {
    const loans = await sql`
      SELECT
        lr.id AS loan_id,
        lr.loan_type,
        lr.loan_amount,
        lr.tenure,
        lr.status AS loan_status,
        lr.created_at AS loan_created_at,

        u.id AS user_id,
        u.name AS user_name,
        u.email,
        u.mobile_number,

        a.id AS account_id,
        a.account_number,
        a.account_type,
        a.balance,
        a.status AS account_status

      FROM loan_req lr
      INNER JOIN users u ON lr.user_id = u.id
      LEFT JOIN accounts a ON a.user_id = u.id
      ORDER BY lr.created_at DESC
    `;

    return res.status(200).json({
      status: true,
      message: "Loan requests fetched successfully",
      data: loans,
    });
  } catch (error) {
    console.error("Get Loan Request Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { action, reject_reason, interest_rate } = req.body;
    const role = req.role;
    const adminId = req.id;

    const loan = await sql`
      SELECT lr.*, u.email, u.name, a.account_number
      FROM loan_req lr
      JOIN users u ON u.id = lr.user_id
      JOIN accounts a ON a.user_id = u.id
      WHERE lr.id = ${loan_id}
    `;

    if (loan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Loan request not found",
      });
    }

    const loanReq = loan[0];

    if (action === "reject") {
      await sql`
        UPDATE loan_req
        SET status = 'rejected'
        WHERE id = ${loan_id}
      `;

      await sendEmail(
        loanReq.email,
        "Loan Request Rejected",
        `Dear ${loanReq.name},

Your loan request has been rejected.

Loan ID: ${loanReq.id}

Reason:
${reject_reason || "Not specified"}

Regards,
MYBANK`
      );

      return res.status(200).json({
        success: true,
        message: "Loan rejected successfully",
      });
    }

    if (role === "staff" && action === "approve") {
      await sql`
        UPDATE loan_req
        SET staff_approved = true,
            status = 'under_process'
        WHERE id = ${loan_id}
      `;

      await sendEmail(
        loanReq.email,
        "Loan Under Process",
        `Dear ${loanReq.name},

Your loan request is now under process.

Loan ID: ${loanReq.id}

Regards,
MYBANK`
      );

      return res.status(200).json({
        success: true,
        message: "Loan moved to under process",
      });
    }

    if (role === "admin" && action === "approve") {
      if (!interest_rate) {
        return res.status(400).json({
          success: false,
          message: "Interest rate is required",
        });
      }

      await sql`
        INSERT INTO loans (
          user_id,
          account_number,
          loan_type,
          interest_rate,
          status,
          approved_by,
          approved_at,
          loan_amount,
          tenure,
          documents,
          loan_req_id
        ) VALUES (
          ${loanReq.user_id},
          ${loanReq.account_number},
          ${loanReq.loan_type},
          ${interest_rate},
          'approved',
          ${adminId},
          NOW(),
          ${loanReq.loan_amount},
          ${loanReq.tenure},
          ${loanReq.documents},
          ${loanReq.id}
        )
      `;

      await sql`
        DELETE FROM loan_req
        WHERE id = ${loan_id}
      `;

      await sendEmail(
        loanReq.email,
        "Loan Approved",
        `Dear ${loanReq.name},

Your loan has been approved.

Loan Amount: ₹${loanReq.loan_amount}

Regards,
MYBANK`
      );

      return res.status(200).json({
        success: true,
        message: "Loan approved and moved to loans table",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action or role",
    });
  } catch (error) {
    console.error("Loan Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


