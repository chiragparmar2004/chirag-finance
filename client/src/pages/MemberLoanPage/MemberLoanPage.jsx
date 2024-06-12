import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Dummy loan data, replace with actual loan data from your backend or state
const loans = [
  { memberId: 1, loanId: 1, status: "active", amount: 1000 },
  { memberId: 1, loanId: 2, status: "closed", amount: 2000 },
  { memberId: 2, loanId: 3, status: "active", amount: 3000 },
  // Add more loans as needed
];

const MemberLoanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memberLoans = loans.filter(
    (loan) => loan.memberId === parseInt(id) && loan.status === "active"
  );

  const handleLoanClick = (loanId) => {
    navigate(`/loan/${loanId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Member Loans</h1>
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Active Loans for Member {id}
        </h2>
        <ul>
          {memberLoans.length > 0 ? (
            memberLoans.map((loan) => (
              <li
                key={loan.loanId}
                className="border-b border-gray-200 py-2 cursor-pointer"
                onClick={() => handleLoanClick(loan.loanId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Loan ID: {loan.loanId}
                    </h3>
                    <p className="text-gray-500">Amount: ${loan.amount}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No active loans for this member.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MemberLoanPage;
