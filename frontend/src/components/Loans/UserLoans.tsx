import React from "react";

const UserLoans = () => {
  const data = [
    {
      user_id: 14,
      name: "Parmar jay rajubhai",
      email: "jayparmar2787@gmail.com",
      account_number: "96703293347709",
      account_type: "current",
      balance: "3046000.00",
      loan_id: 25,
      loan_type: "home",
      loan_amount: "500000.00",
      tenure: 40,
      status: "approved",
      created_at: "2025-12-27T10:52:38.660Z",
    },
    {
      user_id: 14,
      name: "Parmar jay rajubhai",
      email: "jayparmar2787@gmail.com",
      account_number: "96703293347709",
      account_type: "current",
      balance: "3046000.00",
      loan_id: 26,
      loan_type: "personal",
      loan_amount: "120000.00",
      tenure: 5,
      status: "pending",
      created_at: "2025-11-15T09:12:10.000Z",
    },
  ];


  return (
    <div className="max-w-5xl mx-auto p-4 text-sm">
      <h3 className="text-base font-semibold mb-3">
        Your Existing Loans
      </h3>


      {/* Loan List */}
      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">Loan ID</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Tenure</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((loan) => (
            <tr key={loan.loan_id} className="border-b">
              <td className="p-2">{loan.loan_id}</td>
              <td className="p-2 capitalize">{loan.loan_type}</td>
              <td className="p-2">
                ₹ {Number(loan.loan_amount).toLocaleString()}
              </td>
              <td className="p-2">{loan.tenure} yrs</td>
              <td className="p-2">{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserLoans;
