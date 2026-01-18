import sql from "../utils/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        id,
        from_account,
        to_account,
        amount,
        transaction_type,
        created_at
      FROM transactions
      ORDER BY created_at DESC
    `;
    res.status(200).json({ status: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to fetch transactions" });
  }
};
export const getTransactionAnalysis = async (req, res) => {
  try {
    /* ================= DAILY ================= */
    const daily = await sql`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*)::int AS total
      FROM transactions
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    /* ================= MONTHLY ================= */
    const monthly = await sql`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        SUM(
          CASE 
            WHEN transaction_type IN ('deposit','transfer','upi','neft','rtgs','credit')
            THEN amount ELSE 0 
          END
        ) AS credit,
        SUM(
          CASE 
            WHEN transaction_type = 'withdraw'
            THEN amount ELSE 0 
          END
        ) AS debit
      FROM transactions
      GROUP BY month
      ORDER BY month
    `;

    /* ================= TYPE DISTRIBUTION ================= */
    const typeDist = await sql`
      SELECT 
        transaction_type,
        COUNT(*)::int AS total
      FROM transactions
      GROUP BY transaction_type
    `;

    /* ================= SUMMARY ================= */
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_transactions,
        COALESCE(SUM(amount), 0) AS total_amount,
        COALESCE(
          SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END),
          0
        ) AS total_deposit,
        COALESCE(
          SUM(CASE WHEN transaction_type = 'withdraw' THEN amount ELSE 0 END),
          0
        ) AS total_withdraw
      FROM transactions
    `;

    res.status(200).json({
      status: true,
      data: {
        daily: {
          labels: daily.map(r => r.date),
          datasets: [
            {
              label: "Transactions",
              data: daily.map(r => r.total),
            },
          ],
        },
        monthly: {
          labels: monthly.map(r => r.month),
          datasets: [
            {
              label: "Credit",
              data: monthly.map(r => Number(r.credit)),
            },
            {
              label: "Debit",
              data: monthly.map(r => Number(r.debit)),
            },
          ],
        },
        typeDistribution: {
          labels: typeDist.map(r => r.transaction_type),
          datasets: [
            {
              label: "Transactions",
              data: typeDist.map(r => r.total),
            },
          ],
        },
        summary: summary[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch transaction analysis",
    });
  }
};
