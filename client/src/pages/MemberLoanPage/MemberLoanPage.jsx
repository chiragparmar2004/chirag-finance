import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { format, parseISO } from "date-fns";

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
      <h1 className="text-2xl font-bold mb-4 text-white ">
        Active Loans for{" "}
        <span className="text-3xl text-[#0085ff]">{member.name}</span>
      </h1>{" "}
      <div className="bg-[#454545] shadow-custom-inset  p-4 rounded-lg ">
        <ul>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <li
                key={loan._id}
                className=" border-gray-200 py-2 cursor-pointer"
                onClick={() => handleLoanClick(loan._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-1">
                      Loan ID: {loan._id}
                    </h3>
                    <p className="text-white">
                      Start Date :{" "}
                      {format(parseISO(loan.startDate), "dd-MM-yyyy")}
                    </p>
                    <p className="text-2xl text-white">
                      Amount: ₹{loan.amount}
                    </p>
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
