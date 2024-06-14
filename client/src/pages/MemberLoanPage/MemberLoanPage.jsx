import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

// Dummy loan data, replace with actual loan data from your backend or state

const MemberLoanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [member, setMember] = useState("");
  const handleLoanClick = (id) => {
    console.log(id);
    navigate(`/loan/${id}`);
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await apiRequest().get(`/loan/${id}`); // Update the API endpoint as needed
        console.log(response.data.data);
        setLoans(response.data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    const fetchMember = async () => {
      try {
        const response = await apiRequest().get(`/user/${id}`); // Update the API endpoint as needed
        console.log(response.data.data);
        setMember(response.data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchLoans();
    fetchMember();
  }, []);
  // console.log(loans[0]._id);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Member Loans</h1>
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Active Loans for{" "}
          <span className="text-3xl text-red-500">{member.name}</span>
        </h2>
        <ul>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <li
                key={loan._id}
                className="border-b border-gray-200 py-2 cursor-pointer"
                onClick={() => handleLoanClick(loan._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Loan ID: {loan._id}
                    </h3>
                    <p className="text-gray-500">
                      Start Data: {loan.startDate.toString()}
                    </p>
                    <p className="text-gray-500">Amount: ₹{loan.amount}</p>
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
