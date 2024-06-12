import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { format, addDays } from "date-fns";
import AddEmiModal from "../../components/AddEmiModal/AddEmiModal";
import cashIcon from "../../../public/dollar_1052866.png";
import gpayIcon from "../../../public/google-pay_6124998.png";

// Dummy loan data, replace with actual loan data from your backend or state
const loans = [
  {
    loanId: 1,
    memberId: 1,
    status: "active",
    amount: 1000,
    startDate: "2024-01-01",
    endDate: "2024-04-10",
  },
  {
    loanId: 2,
    memberId: 1,
    status: "closed",
    amount: 2000,
    startDate: "2023-01-01",
    endDate: "2023-04-10",
  },
  {
    loanId: 3,
    memberId: 2,
    status: "active",
    amount: 3000,
    startDate: "2024-02-01",
    endDate: "2024-05-10",
  },
  // Add more loans as needed
];

// Generate date range between two dates
const generateDateRange = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
};

const LoanDetailPage = () => {
  const { loanId } = useParams();
  const loan = loans.find((loan) => loan.loanId === parseInt(loanId));
  const [emiData, setEmiData] = useState({});
  const [lastFilledIndex, setLastFilledIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!loan) {
    return <div>Loan not found</div>;
  }

  const dateRange = generateDateRange(loan.startDate, loan.endDate);

  const handleAddEmi = () => {
    setIsModalOpen(true);
  };
  const renderPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash":
        return <img src={cashIcon} height="50px" width="25px" />;
      case "GPay":
        return <img src={gpayIcon} height="50px" width="35px" />;
      default:
        return null;
    }
  };
  const handleModalSubmit = (amount, paymentMethod, paymentDate) => {
    const emiRate = 100; // Assuming EMI rate of 100 per day
    const emiDays = Math.floor(amount / emiRate);

    const newEmiData = { ...emiData };
    let pendingDays = emiDays;
    let index = lastFilledIndex + 1;

    while (pendingDays > 0 && index < dateRange.length) {
      const dateKey = format(dateRange[index], "yyyy-MM-dd");
      if (!newEmiData[dateKey]) {
        if (pendingDays === emiDays) {
          newEmiData[dateKey] = {
            amount,
            method: paymentMethod,
            date: paymentDate,
          }; // First day gets the full amount
        } else {
          newEmiData[dateKey] = {
            amount: 0,
            method: paymentMethod,
            date: paymentDate,
          }; // Subsequent days get 0
        }
        pendingDays--;
        setLastFilledIndex(index);
      }
      index++;
    }

    setEmiData(newEmiData);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-blue-200">
      <div className="container mx-auto py-8 ">
        <h1 className="text-4xl font-bold mb-8">Loan Details</h1>
        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Loan ID: {loan.loanId}</h2>
          <p className="mb-2">
            <strong>Member ID:</strong> {loan.memberId}
          </p>
          <p className="mb-2">
            <strong>Amount:</strong> ${loan.amount}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {loan.status}
          </p>
          <p className="mb-2">
            <strong>Start Date:</strong> {loan.startDate}
          </p>
          <p className="mb-2">
            <strong>End Date:</strong> {loan.endDate}
          </p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Loan Data</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddEmi}
          >
            Add EMI
          </button>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Serial Number</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">EMI Amount</th>
                  <th className="py-2 px-4 border-b">Payment Method</th>
                  <th className="py-2 px-4 border-b">Payment Date</th>
                </tr>
              </thead>
              <tbody className="text-2xl text-center ">
                {dateRange.map((date, index) => {
                  const dateKey = format(date, "yyyy-MM-dd");
                  const emiEntry = emiData[dateKey] || {};
                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        {format(date, "dd-MM-yyyy")}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {emiEntry.amount !== undefined ? emiEntry.amount : ""}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center items-center">
                          {renderPaymentMethodIcon(emiEntry.method)}
                        </div>
                      </td>

                      <td className="py-2 px-4 border-b">
                        {emiEntry.date
                          ? format(new Date(emiEntry.date), "dd-MM-yyyy")
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <AddEmiModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default LoanDetailPage;
