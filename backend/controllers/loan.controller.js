import sql from "../utils/db.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendEmail from "../utils/sendEmail.js";


export const applyLoan = async (req, res) => {
  try {
    const role = req.role; // 'user' | 'staff'
    let user_id;

    const { loan_type, loan_amount, tenure, account_number } = req.body;

    /* ================= VALIDATION ================= */

    if (!loan_type || !loan_amount || !tenure) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
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
        status: false,
        message: "Invalid loan type",
      });
    }


    if (role === "user") {
      user_id = req.id;
    }

    if (role === "staff") {
      if (!account_number) {
        return res.status(400).json({
          status: false,
          message: "Account number required",
        });
      }

      const account = await sql`
        SELECT user_id
        FROM accounts
        WHERE account_number = ${account_number};
      `;

      if (account.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Invalid account number",
        });
      }

      user_id = account[0].user_id;
    }

    /* ================= FILE UPLOAD ================= */

    const uploadedFiles = {};

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const fieldName = file.fieldname;

        if (!uploadedFiles[fieldName]) {
          uploadedFiles[fieldName] = [];
        }

        const fileDataUri = getDataUri(file);
        const isPDF = file.mimetype === "application/pdf";

        const result = await cloudinary.uploader.upload(
          fileDataUri.content,
          {
            folder: `MYBANK/loan_documents/${loan_type}`,
            resource_type: isPDF ? "raw" : "image",
          }
        );

        uploadedFiles[fieldName].push({
          url: result.secure_url,
          public_id: result.public_id,
          file_type: isPDF ? "pdf" : "image",
        });
      }
    }

    /* ================= INSERT ================= */

    const loan = await sql`
      INSERT INTO loan_req (
        user_id,
        loan_type,
        loan_amount,
        tenure,
        documents,
        staff_approved
      )
      VALUES (
        ${user_id},
        ${loan_type},
        ${loan_amount},
        ${loan_amount},
        ${Object.keys(uploadedFiles).length ? uploadedFiles : null},
        ${role === "staff"}
      )
      RETURNING *;
    `;

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      status: true,
      message: "Loan request submitted successfully",
    });

  } catch (error) {
    console.error("Apply loan error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const getLoanReq = async (req, res) => {
  try {
    const loans = await sql`
      SELECT
        u.name AS "userName",
        u.mobile_number AS "mobileNumber",
        u.aadhar_number AS "aadharCardNumber",
        u.pan_number AS "panNumber",

        a.account_number AS "accountNumber",
        a.account_type AS "accountType",
        a.balance,

        lr.loan_type AS "loanType",
        lr.status,
        lr.id AS loan_id

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
    console.error("Get Loan Requests Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const getLoanReqById = async (req, res) => {
  try {
    const { loanReqId } = req.params;

    const [loan] = await sql`
      SELECT
        lr.id AS loan_id,
        lr.loan_type,
        lr.loan_amount,
        lr.tenure,
        lr.documents,
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
      WHERE lr.id = ${loanReqId}
    `;

    if (!loan) {
      return res.status(404).json({
        status: false,
        message: "Loan request not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Loan request fetched successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Get Loan Request By ID Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};


export const updateLoanStatus = async (req, res) => {
  const { loan_id } = req.params;
  const { action, reject_reason, interest_rate } = req.body;
  const role = req.role;
  const adminId = req.id;

  try {
    const loan = await sql`
      SELECT lr.*, u.email, u.name, a.account_number
      FROM loan_req lr
      JOIN users u ON u.id = lr.user_id
      JOIN accounts a ON a.user_id = u.id
      WHERE lr.id = ${loan_id}
    `;

    if (loan.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Loan request not found",
      });
    }

    const loanReq = loan[0];

    /* ================== REJECT (STAFF / ADMIN) ================== */
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
Reason: ${reject_reason || "Not specified"}

Regards,
MYBANK`
      );

      return res.status(200).json({
        status: true,
        message: "Loan rejected successfully",
      });
    }

    /* ================== STAFF APPROVAL ================== */
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
        status: true,
        message: "Loan moved to under process",
      });
    }

    /* ================== ADMIN FINAL APPROVAL ================== */
    if (role === "admin" && action === "approve") {
      try {
        /* 🔹 START TRANSACTION */
        await sql`BEGIN`;

        // 1️⃣ Create loan
        const loanResult = await sql`
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
          RETURNING id
        `;

        const newLoanId = loanResult[0].id;

        // 2️⃣ Credit account
        await sql`
          UPDATE accounts
          SET balance = balance + ${loanReq.loan_amount}
          WHERE account_number = ${loanReq.account_number}
        `;

        // 3️⃣ Insert transaction history (YOUR TABLE STRUCTURE)
        await sql`
          INSERT INTO transactions (
            account_number,
            transaction_type,
            amount,
            currency,
            from_account,
            to_account,
            description,
            initiated_by_staff
          ) VALUES (
            ${loanReq.account_number},
            'credit',
            ${loanReq.loan_amount},
            'INR',
            'bank',
            ${loanReq.account_number},
            ${'Loan Approved - Loan ID ' + newLoanId},
            ${adminId}
          )
        `;

        // 4️⃣ Delete loan request
        await sql`
          DELETE FROM loan_req
          WHERE id = ${loan_id}
        `;

        /* 🔹 COMMIT ONLY IF ALL SUCCESS */
        await sql`COMMIT`;

        await sendEmail(
          loanReq.email,
          "Loan Approved",
          `Dear ${loanReq.name},

Your loan has been approved and credited.

Amount: ₹${loanReq.loan_amount}
Account: ${loanReq.account_number}

Regards,
MYBANK`
        );

        return res.status(200).json({
          status: true,
          message: "Loan approved successfully",
        });

      } catch (err) {
        /* 🔴 CANCEL EVERYTHING */
        await sql`ROLLBACK`;

        console.error("Admin Loan Approval Error:", err);

        return res.status(500).json({
          status: false,
          message: "Loan approval failed. All changes rolled back.",
        });
      }
    }

    return res.status(400).json({
      status: false,
      message: "Invalid action or role",
    });

  } catch (error) {
    console.error("Loan Status Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};


export const loanDetails = async (req, res) => {
  try {
    const userId = req.id;
    const role = req.role;
    const { loanId } = req.params;

    let result;
    console.log(userId);
    if (role === "user") {
      if (loanId) {
        result = await sql`
          SELECT
            l.id AS loan_id,
            l.loan_type,
            l.loan_amount,
            l.tenure,
            l.status,
            l.loan_req_id,
            l.created_at,
            l.policy_number

          FROM loans l
          WHERE l.user_id = ${userId}
          AND l.id = ${loanId}
          ORDER BY l.created_at DESC
        `;
      } else {
        result = await sql`
          SELECT
            l.id AS loan_id,
            l.loan_type,
            l.loan_amount,
            l.tenure,
            l.status,
            l.created_at,
            l.loan_req_id,
            l.policy_number
          FROM loans l
          WHERE l.user_id = ${userId}
          ORDER BY l.created_at DESC
        `;
      }
    } else {
      if (loanId) {
        result = await sql`
          SELECT
             

            l.id AS loan_id,
            l.loan_type,
            l.loan_amount,
            l.tenure,
            l.status,
            l.created_at,
            l.loan_req_id,
            l.policy_number
          FROM loans l
         
          ORDER BY l.created_at DESC
        `;
      } else {
        result = await sql`
          SELECT
 

            l.id AS loan_id,
            l.loan_type,
            l.loan_amount,
            l.tenure,
            l.status,
            l.created_at,
            l.loan_req_id,
             l.policy_number

          FROM loans l
         
          ORDER BY l.created_at DESC
        `;
      }
    }

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No loan data found",
      });
    }

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    console.error("Loan Details Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};


export const getLoanPaymentDetails = async (req, res) => {
  try {
    const userId = req.id;
    const role = req.role;
    const { policyNumber } = req.params;

    if (!policyNumber) {
      return res.status(400).json({
        status: false,
        message: "Policy number is required",
      });
    }
    console.log(policyNumber);
    // 🔹 Loan + payment summary (based on policy_number)
    const loanResult = await sql`
      SELECT
        l.id AS loan_id,
        l.policy_number,
        l.user_id,
        l.loan_type,
        l.loan_amount AS remaining_principal,
        l.interest_rate,
        l.tenure,
        l.status,
        l.created_at,

        COALESCE(SUM(lp.amount), 0) AS total_paid,
        COALESCE(SUM(lp.principal_component), 0) AS principal_paid,
        COALESCE(SUM(lp.interest_component), 0) AS interest_paid,
        COUNT(lp.id) AS paid_emis,

        u.name,
        u.email,
        a.account_number
      FROM loans l
      JOIN users u ON u.id = l.user_id
      LEFT JOIN accounts a ON a.user_id = u.id
      LEFT JOIN loan_payments lp 
        ON lp.policy_number = l.policy_number
      WHERE l.policy_number = ${policyNumber}
      ${role === "user" ? sql`AND l.user_id = ${userId}` : sql``}
      GROUP BY l.id, u.id, a.id
    `;

    if (loanResult.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Loan not found or unauthorized",
      });
    }

    const loan = loanResult[0];

    const remainingPrincipal = Number(loan.remaining_principal);
    const principalPaid = Number(loan.principal_paid);
    const interestPaid = Number(loan.interest_paid);
    const totalPaid = Number(loan.total_paid);

    const originalLoanAmount = remainingPrincipal + principalPaid;

    const totalInterest =
      (originalLoanAmount * loan.interest_rate * loan.tenure) / 100;

    const totalPayable = originalLoanAmount + totalInterest;
    const monthlyEmi = totalPayable / loan.tenure;

    const remainingAmount = totalPayable - totalPaid;
    const remainingTenure = loan.tenure - loan.paid_emis;

    // 🔹 EMI payment history (policy based)
    const payments = await sql`
      SELECT
        id AS payment_id,
        policy_number,
        amount,
        principal_component,
        interest_component,
        remaining_balance,
        payment_date,
        payment_method
      FROM loan_payments
      WHERE policy_number = ${policyNumber}
      ORDER BY payment_date ASC
    `;

    return res.status(200).json({
      status: true,
      data: {
        loan_summary: {
          loan_id: loan.loan_id,
          policy_number: loan.policy_number,
          loan_type: loan.loan_type,

          original_loan_amount: Number(originalLoanAmount.toFixed(2)),
          remaining_principal: Number(remainingPrincipal.toFixed(2)),
          interest_rate: Number(loan.interest_rate),
          tenure: loan.tenure,

          total_interest: Number(totalInterest.toFixed(2)),
          total_payable: Number(totalPayable.toFixed(2)),
          monthly_emi: Number(monthlyEmi.toFixed(2)),

          total_paid: Number(totalPaid.toFixed(2)),
          principal_paid: Number(principalPaid.toFixed(2)),
          interest_paid: Number(interestPaid.toFixed(2)),

          remaining_amount: Number(remainingAmount.toFixed(2)),
          paid_emis: loan.paid_emis,
          remaining_tenure: remainingTenure,

          status: loan.status,
        },
        payments,
      },
    });

  } catch (error) {
    console.error("Get Loan Payment Details Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};



export const loanPayment = async (req, res) => {
  try {
    const role = req.role;          // user | staff | admin
    const payerId = req.id;         // logged-in user
    const { amount, payment_method, policy_number } = req.body;
    console.log(policy_number);
    if (!policy_number || !amount || amount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Policy number and valid amount are required",
      });
    }

    /* ============================
       1️⃣ Fetch Loan by policy_number
    ============================ */
    const loanRows = await sql`
      SELECT id, user_id, loan_amount, status
      FROM loans
      WHERE policy_number = ${policy_number}
    `;

    if (loanRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Loan not found",
      });
    }

    const loan = loanRows[0];

    if (loan.status !== "approved") {
      return res.status(400).json({
        status: false,
        message: "Loan is not active",
      });
    }

    // User can pay only own loan
    if (role === "user" && loan.user_id !== payerId) {
      return res.status(403).json({
        status: false,
        message: "You can pay only your own loan",
      });
    }

    if (amount > loan.loan_amount) {
      return res.status(400).json({
        status: false,
        message: "Amount exceeds remaining loan balance",
      });
    }

    /* ============================
       2️⃣ Fetch Loan Owner Account
    ============================ */
    const accountRows = await sql`
      SELECT account_number, balance
      FROM accounts
      WHERE user_id = ${loan.user_id}
    `;

    if (accountRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Loan owner account not found",
      });
    }

    const account = accountRows[0];

    // If NOT cash → check balance
    if (payment_method !== "cash" && account.balance < amount) {
      return res.status(400).json({
        status: false,
        message: "Insufficient balance in user's account",
      });
    }

    const remainingBalance = loan.loan_amount - amount;

    /* ============================
       3️⃣ TRANSACTION
    ============================ */
    await sql.transaction([
      // 1️⃣ Deduct balance (only if not cash)
      ...(payment_method !== "cash"
        ? [
          sql`
            UPDATE accounts
            SET balance = balance - ${amount}
            WHERE user_id = ${loan.user_id}
          `,
        ]
        : []),

      // 2️⃣ Insert payment
      sql`
        INSERT INTO loan_payments (
          loan_id,
          amount,
          principal_component,
          interest_component,
          remaining_balance,
          payment_method,
          policy_number
        ) VALUES (
          ${loan.id},
          ${amount},
          ${amount},
          0,
          ${remainingBalance},
          ${payment_method || "account_debit"},
          ${policy_number}
        )
      `,

      // 3️⃣ Update loan
      sql`
        UPDATE loans
        SET loan_amount = ${remainingBalance},
            status = ${remainingBalance === 0 ? "closed" : "approved"},
            updated_at = NOW()
        WHERE id = ${loan.id}
      `,
    ]);

    return res.status(200).json({
      status: true,
      message:
        role === "user"
          ? "Loan payment successful"
          : "Loan payment completed by staff/admin",
      data: {
        paid_amount: amount,
        remaining_balance: remainingBalance,
        payment_method: payment_method || "online",
      },
    });

  } catch (error) {
    console.error("Loan Payment Error:", error);

    return res.status(500).json({
      status: false,
      message: "Loan payment failed",
    });
  }
};
