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
    const daily = await sql`
      SELECT DATE(created_at) as date, COUNT(*) as total
      FROM transactions
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const monthly = await sql`
      SELECT TO_CHAR(created_at,'YYYY-MM') as month,
             SUM(CASE WHEN transaction_type IN ('DEPOSIT','TRANSFER') THEN amount ELSE 0 END) as credit,
             SUM(CASE WHEN transaction_type = 'WITHDRAW' THEN amount ELSE 0 END) as debit
      FROM transactions
      GROUP BY month
      ORDER BY month
    `;

    const typeDist = await sql`
      SELECT transaction_type, COUNT(*) as total
      FROM transactions
      GROUP BY transaction_type
    `;

    const summary = await sql`
      SELECT
        COUNT(*) as total_transactions,
        SUM(amount) as total_amount,
        SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as total_deposit,
        SUM(CASE WHEN transaction_type='WITHDRAW' THEN amount ELSE 0 END) as total_withdraw
      FROM transactions
    `;

    res.status(200).json({
      status: true,
      data: {
        daily: {
          labels: daily.map(r => r.date),
          datasets: [{ label: "Transactions", data: daily.map(r => Number(r.total)) }],
        },
        monthly: {
          labels: monthly.map(r => r.month),
          datasets: [
            { label: "Credit", data: monthly.map(r => Number(r.credit)) },
            { label: "Debit", data: monthly.map(r => Number(r.debit)) },
          ],
        },
        typeDistribution: {
          labels: typeDist.map(r => r.transaction_type),
          datasets: [{ label: "Transactions", data: typeDist.map(r => Number(r.total)) }],
        },
        summary: summary[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to fetch transaction analysis" });
  }
};