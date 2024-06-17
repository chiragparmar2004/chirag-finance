import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, addDays, parseISO } from "date-fns";
import AddEmiModal from "../../components/AddEmiModal/AddEmiModal";
import RenewLoanModal from "../../components/RenewLoanModal/RenewLoanModal"; // Import RenewLoanModal component
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
// import { BsCashCoin } from "react-icons/bs";
import DoughnutChart from "../../components/Charts/DoughnutChart";

const generateDateRange = (startDate, endDate) => {
  const dateArray = [];

  if (!startDate || !endDate) {
    return dateArray;
  }

  let currentDate = parseISO(startDate);
  const end = parseISO(endDate);

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
  const [isRenewLoanModalOpen, setIsRenewLoanModalOpen] = useState(false);
  // const remainingAmount = loan.amount - loan.collectedMoney;

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await apiRequest().get(`/loan/details/${loanId}`);
        setLoan(response.data.data);
        if (response.data.data.emis) {
          setEmiData(response.data.data.emis);
        } else {
          setEmiData([]);
        }
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };
    fetchLoanData();
  }, [loanId, isModalOpen, isRenewLoanModalOpen]);

  if (!loan) {
    return <div>Loading...</div>;
  }

  const dateRange = generateDateRange(loan.startDate, loan.endDate);

  const handleAddEmi = () => {
    setIsModalOpen(true);
  };

  const handleRenewLoanModalSubmit = async (
    newLoanAmount,
    interest,
    startDate,
    paymentType
  ) => {
    try {
      // Make API request to renew loan
      const response = await apiRequest().post(`/loan/renew/${loanId}`, {
        newLoanAmount,
        interest,
        startDate,
        paymentType,
      });

      // Check if the request was successful
      if (response.status !== 201) {
        throw new Error(response.data.message || "Failed to renew loan");
      }

      // Close the modal after successful submission
      setIsRenewLoanModalOpen(false);
      toast.success("Loan renewed successfully");
      // location.reload();
    } catch (error) {
      console.error("Error renewing loan:", error.message);
      toast.error(error.message || "Failed to renew loan. Please try again.");
    }
  };

  const handleRenewLoan = () => {
    setIsRenewLoanModalOpen(true);
  };

  // const renderPaymentMethodIcon = (method) => {
  //   switch (method) {
  //     case "Cash":
  //       return <BsCashCoin />;
  //     case "GPay":
  //       return <BsCashCoin />;
  //     default:
  //       return null;
  //   }
  // };
  const handleModalSubmit = async (amount, paymentMethod) => {
    const toastId = toast.loading("Adding EMI...");

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
      toast.success("EMI added successfully", {
        id: toastId,
      });
      // location.reload();
    } catch (error) {
      console.error("Error adding EMI:", error.message);
      toast.error("Failed to add EMI. Please try again.");
    }
  };
  return (
    <div className="">
      <div className="  mx-auto ">
        <div className="bg-[#454545] shadow-custom-inset p-4  flex flex-row justify-between  rounded-lg mb-8 text-black">
          <div className="flex flex-col">
            {" "}
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

          <div className=" flex items-center justify-center h-[270px] w-[270px]   ">
            <DoughnutChart
              collectedAmount={loan.collectedMoney}
              totalAmount={loan.amount}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddEmi}
            className="w-1/8 cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          >
            Add EMI
          </button>
          <button
            onClick={handleRenewLoan}
            className="w-1/8 cursor-pointer transition-all bg-green-500 text-white px-6 py-2 rounded-lg border-green-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          >
            Renew Loan
          </button>
        </div>

        <div className="">
          <table className="w-full text-lg text-left bg-[#1e1e1e]">
            <caption className="p-5 text-2xl font-semibold text-left text-white">
              EMI Payment Details
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                Explore your EMI payment records to stay updated with your
                financial transactions.
              </p>
            </caption>
            <thead className="text-xl text-white text-center uppercase bg-[#1e1e1e]">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-4 border-b border-r border-black"
                >
                  Serial No.
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 border-b border-r border-black"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 border-b border-r border-black"
                >
                  EMI Amount
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 border-b border-r border-black"
                >
                  Payment Method
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 border-b border-r border-black"
                >
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
                      "bg-[#454545] shadow-custom-inset  text-black text-2xl text-center"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-black border-b border-r border-black">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
                      {format(date, "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
                      {emiEntry.amount !== undefined
                        ? `${emiEntry.amount}`
                        : ""}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
                      {emiEntry.paymentType || ""}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
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

        <RenewLoanModal
          isOpen={isRenewLoanModalOpen}
          onRequestClose={() => setIsRenewLoanModalOpen(false)}
          onSubmit={handleRenewLoanModalSubmit}
        />
      </div>
    </div>
  );
};

export default LoanDetailPage;
