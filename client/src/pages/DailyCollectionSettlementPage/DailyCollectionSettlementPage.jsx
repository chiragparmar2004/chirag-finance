import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";
import { format } from "date-fns";

const DailyCollectionSettlementPage = () => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd")); // Default to today's date
  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [gpayAmount, setGpayAmount] = useState(0);
  const [settlements, setSettlements] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDueSettlements, setUserDueSettlements] = useState([]);

  useEffect(() => {
    fetchPaymentsByDate(date);
    fetchUserDueSettlements();
  }, [date]);

  const fetchPaymentsByDate = async (selectedDate) => {
    try {
      setLoading(true);
      const response = await apiRequest().get(
        `/settlement/settlementByDate/${selectedDate}`
      );
      setLoading(false);
      console.log(response);

      if (response.data.success && response.data.data) {
        setSettlements(response.data.data);
        setTotalAmountDue(response.data.data.dueAmount);
        fetchTransactionHistory(response.data.data._id);
        toast.success("Payments fetched successfully");
      } else if (response.data.success && !response.data.data) {
        toast("No settlement found for the selected date");
        setSettlements(null);
        setTotalAmountDue(0);
        setTransactionHistory([]);
      } else {
        toast.error("Failed to fetch settlement");
      }
    } catch (error) {
      console.error("Error fetching payments by date:", error);
      setLoading(false);

      if (error.response && error.response.status === 404) {
        toast("No settlement found for the selected date");
      } else {
        toast.error("Error fetching payments by date");
      }

      setSettlements(null);
      setTotalAmountDue(0);
      setTransactionHistory([]);
    }
  };

  const fetchUserDueSettlements = async () => {
    try {
      const response = await apiRequest().get(`/settlement/dueSettlements`);
      if (response.data.success) {
        setUserDueSettlements(response.data.data);
      } else {
        toast.error("Failed to fetch user due settlements");
      }
    } catch (error) {
      console.error("Error fetching user due settlements:", error);
      toast.error("Error fetching user due settlements");
    }
  };

  const fetchTransactionHistory = async (settlementId) => {
    try {
      const response = await apiRequest().get(
        `/settlement/history/${settlementId}`
      );
      console.log(response);
      if (response.data.success) {
        setTransactionHistory(response.data.data);
      } else {
        toast.error("Failed to fetch transaction history");
        setTransactionHistory([]);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Error fetching transaction history");
    }
  };

  const handleCreateSettlement = async () => {
    if (!settlements) {
      toast.error("No settlements found for the selected date");
      return;
    }

    const id = settlements._id;
    try {
      const response = await apiRequest().put(`/settlement/update/${id}`, {
        cashAmount,
        gpayAmount,
      });
      toast.success("Settlement updated successfully");
      setSettlements(response.data.data);
      setTotalAmountDue(response.data.data.dueAmount);
      setCashAmount(0);
      setGpayAmount(0);
      fetchTransactionHistory(id);
      fetchUserDueSettlements();
    } catch (error) {
      console.error("Error creating settlement:", error);
      toast.error("Error creating settlement");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl  p-8 shadow-md rounded-md mb-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Daily Collection Settlement
        </h1>

        <div className="flex flex-row  gap-10 w-full justify-between">
          <div className="flex-1 bg-gray-200 p-6 rounded-md mb-6">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="totalAmountDue"
              >
                Total Amount Due (₹{totalAmountDue})
              </label>
              <input
                type="number"
                id="totalAmountDue"
                placeholder="Total Amount Due"
                value={totalAmountDue}
                className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cashAmount"
              >
                Cash Amount
              </label>
              <input
                id="cashAmount"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Cash Amount"
                value={cashAmount}
                onChange={(e) => setCashAmount(parseInt(e.target.value))}
                className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="gpayAmount"
              >
                GPay Amount
              </label>
              <input
                id="gpayAmount"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="GPay Amount"
                value={gpayAmount}
                onChange={(e) => setGpayAmount(parseInt(e.target.value))}
                className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>

            <button
              onClick={handleCreateSettlement}
              className="w-full  cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              {loading ? "Loading..." : "Update Settlement"}
            </button>
          </div>
          <div className="flex-2 bg-gray-200 p-6 rounded-md mb-6">
            {settlements ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2">Current Settlement</h2>
                <p className="text-lg font-semibold">
                  Date: {format(new Date(settlements.date), "dd-MM-yyyy")}
                </p>
                <p className="text-lg font-semibold">
                  Total Due: ₹{settlements.totalAmountDue}
                </p>
                <p className="text-lg font-semibold">
                  Amount Received: ₹{settlements.amountReceived}
                </p>
                <p className="text-lg font-semibold">
                  Cash: ₹{settlements.cashAmount}
                </p>
                <p className="text-lg font-semibold">
                  GPay: ₹{settlements.gpayAmount}
                </p>
                <p className="text-lg font-semibold">
                  Due Amount: ₹{settlements.dueAmount}
                </p>
              </div>
            ) : (
              <div className="text-center  flex items-center py-8">
                <p className="text-black text-wrap text-2xl mt-28">
                  No settlement found
                </p>
              </div>
            )}
          </div>
        </div>

        {transactionHistory.length > 0 ? (
          <div className="overflow-hidden rounded-lg">
            <table className="w-full text-left bg-[#1e1e1e]">
              <caption className="p-5 text-2xl font-semibold text-left text-white">
                Transaction History
              </caption>
              <thead className="text-xl text-white text-center uppercase bg-[#1e1e1e]">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b  border-gray-200 "
                  >
                    Amount (₹)
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-gray-200"
                  >
                    Payment Type
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-gray-200"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((transaction, index) => (
                  <tr
                    key={transaction._id}
                    className="bg-[#454545] shadow-custom-inset text-black text-xl text-center"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-black border-b border-black border-r">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-4 py-3 border-b border-black border-r">
                      Cash: ₹{transaction.paymentType.cash} : GPay: ₹
                      {transaction.paymentType.gpay}
                    </td>
                    <td className="px-4 py-3 border-b border-black border-l">
                      {format(
                        new Date(transaction.date),
                        "dd-MM-yyyy HH:mm:ss"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-blue-50 px-2 py-5 rounded-lg">
            <p className="text-lg font-semibold  text-center">
              No transaction history available
            </p>
          </div>
        )}

        <div>
          <h2 className="p-5 text-2xl font-semibold text-left text-white">
            Due Settlements
          </h2>
          <div className="overflow-auto max-h-96">
            {userDueSettlements.length > 0 ? (
              userDueSettlements.map((dueSettlement) => (
                <div
                  key={dueSettlement._id}
                  className="bg-[#454545] shadow-custom-inset p-4 mb-4 rounded-md shadow"
                >
                  <p className="text-lg font-semibold">
                    Date: {format(new Date(dueSettlement.date), "dd-MM-yyyy")}
                  </p>
                  <p className="text-lg font-semibold">
                    Total Due: ₹{dueSettlement.dueAmount}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-[#454545] shadow-custom-inset px-2 py-5 rounded-lg">
                <p className="text-lg font-semibold  text-center">
                  No due settlements
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCollectionSettlementPage;
