import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, addDays, parseISO } from "date-fns";
import AddEmiModal from "../../components/AddEmiModal/AddEmiModal";
import apiRequest from "../../lib/apiRequest"; // Ensure this is correctly set up for your API requests

import toast from "react-hot-toast";
import { BsCashCoin } from "react-icons/bs";

// Generate date range between two dates
const generateDateRange = (startDate, endDate) => {
  const dateArray = [];

  // Ensure startDate and endDate are valid before parsing
  if (!startDate || !endDate) {
    return dateArray;
  }

  let currentDate = parseISO(startDate); // Use parseISO to parse the date string
  const end = parseISO(endDate); // Use parseISO to parse the date string

  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dateArray;
};

const LoanDetailPage = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [emiData, setEmiData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(loan, "loanDetails");
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await apiRequest().get(`/loan/details/${loanId}`);
        setLoan(response.data.data);
        if (response.data.data.emis) {
          setEmiData(response.data.data.emis);
        } else {
          setEmiData([]); // Handle case where emis array is not present
        }
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };
    fetchLoanData();
  }, [loanId, isModalOpen]);

  if (!loan) {
    return <div>Loading...</div>;
  }

  const dateRange = generateDateRange(loan.startDate, loan.endDate);

  const handleAddEmi = () => {
    setIsModalOpen(true);
  };

  const renderPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash":
        return <BsCashCoin />;
      case "GPay":
        return <BsCashCoin />;
      default:
        return null;
    }
  };

  const handleModalSubmit = async (amount, paymentMethod) => {
    try {
      // Make API request to add new EMI
      const response = await apiRequest().post(`/emi/add/${loanId}`, {
        amount,
        paymentType: paymentMethod,
      });

      // Check if the request was successful
      if (response.status !== 201) {
        throw new Error("Failed to add EMI");
      }

      // Close the modal after successful submission
      setIsModalOpen(false);
      toast.success("Emi Added successfully");
      // location.reload();
    } catch (error) {
      console.error("Error adding EMI:", error.message);
      alert("Failed to add EMI. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="container mx-auto py-8">
        <div className="bg-[#454545] shadow-custom-inset p-4 rounded-lg mb-8 text-black">
          <h2 className="text-2xl font-bold mb-4">Loan ID: {loan._id}</h2>
          <p className="mb-2">
            <strong>Member ID:</strong> {loan.member}
          </p>
          <p className="mb-2">
            <strong>Amount:</strong> {loan.amount}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {loan.status}
          </p>
          <p className="mb-2">
            <strong>Start Date:</strong>{" "}
            {format(parseISO(loan.startDate), "dd-MM-yyyy")}
          </p>
          <p className="mb-2">
            <strong>End Date:</strong>{" "}
            {format(parseISO(loan.endDate), "dd-MM-yyyy")}
          </p>
          <p className="mb-2">
            <strong>Collected Amount:</strong> {loan.collectedMoney}
          </p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold"></h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
            onClick={handleAddEmi}
          >
            Add EMI
          </button>
        </div>

        <div className="">
          <table className="w-full text-sm text-left bg-[#1e1e1e]">
            <caption className="p-5 text-lg font-semibold text-left text-black">
              EMI Payment Details
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                Explore your EMI payment records to stay updated with your
                financial transactions.
              </p>
            </caption>
            <thead className="text-xl text-white text-center uppercase bg-[#1e1e1e]">
              <tr>
                <th scope="col" className="py-3 px-4 border-b border-gray-200">
                  Serial No.
                </th>
                <th scope="col" className="py-3 px-4 border-b border-gray-200">
                  Date
                </th>
                <th scope="col" className="py-3 px-4 border-b border-gray-200">
                  EMI Amount
                </th>
                <th scope="col" className="py-3 px-4 border-b border-gray-200">
                  Payment Method
                </th>
                <th scope="col" className="py-3 px-4 border-b border-gray-200">
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody>
              {dateRange.map((date, index) => {
                const emiEntry = emiData[index] || {};
                return (
                  <tr
                    key={index}
                    className={
                      "bg-[#454545] shadow-custom-inset text-black text-2xl text-center"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-black border-b">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {format(date, "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {emiEntry.amount !== undefined
                        ? `${emiEntry.amount}`
                        : ""}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {emiEntry.paymentType || ""}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {emiEntry.date
                        ? format(parseISO(emiEntry.date), "dd/MM/yyyy")
                        : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
