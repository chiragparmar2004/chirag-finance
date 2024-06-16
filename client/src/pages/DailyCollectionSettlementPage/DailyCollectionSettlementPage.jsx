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

      if (response.data.success) {
        setSettlements(response.data.data);
        setTotalAmountDue(response.data.data.dueAmount);
        fetchTransactionHistory(response.data.data._id);
        toast.success("Payments fetched successfully");
      } else {
        toast("No payments found for the selected date");
        setSettlements(null);
        setTotalAmountDue(0);
      }
    } catch (error) {
      console.error("Error fetching payments by date:", error);
      setLoading(false);
      toast.error("Error fetching payments by date");
    }
  };

  const fetchUserDueSettlements = async () => {
    try {
      const response = await apiRequest().get(`/settlement/dueSettlements`);
      if (response.data.success) {
        console.log(response.data);
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
      if (response.data.success) {
        setTransactionHistory(response.data.data);
      } else {
        toast.error("Failed to fetch transaction history");
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
      console.log(response);
      toast.success("Settlement updated successfully");
      setSettlements(response.data.data);
      setTotalAmountDue(response.data.data.dueAmount);
      setCashAmount(0);
      setGpayAmount(0);
      fetchTransactionHistory(id);
    } catch (error) {
      console.error("Error creating settlement:", error);
      toast.error("Error creating settlement");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded-md mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Daily Collection Settlement
        </h1>
        <div className="bg-gray-200 p-6 rounded-md mb-6">
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
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              type="number"
              id="cashAmount"
              placeholder="Cash Amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(parseInt(e.target.value))}
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              type="number"
              id="gpayAmount"
              placeholder="GPay Amount"
              value={gpayAmount}
              onChange={(e) => setGpayAmount(parseInt(e.target.value))}
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleCreateSettlement}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Loading..." : "Update Settlement"}
          </button>
        </div>
        <h2 className="text-xl font-bold mb-2">Settlements</h2>
        <div className="overflow-auto max-h-96">
          {settlements && (
            <div className="bg-blue-200 p-4 mb-4 rounded-md shadow flex justify-between items-center">
              <div>
                <p className="text-black text-2xl">
                  {format(new Date(settlements.date), "dd-MM-yyyy")}
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
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">Transaction History</h2>
        <div className="overflow-auto max-h-96">
          {transactionHistory.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-gray-200 p-4 mb-4 rounded-md shadow"
            >
              <p className="text-lg font-semibold">
                Amount: ₹{transaction.amount}
              </p>
              <p className="text-lg font-semibold">
                Payment Type:{" "}
                {`Cash: ₹${transaction.paymentType.cash}, GPay: ₹${transaction.paymentType.gpay}`}
              </p>
              <p className="text-lg font-semibold">
                Date:{" "}
                {format(new Date(transaction.date), "dd-MM-yyyy HH:mm:ss")}
              </p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-2">Due Settlements</h2>
        <div className="overflow-auto max-h-96">
          {userDueSettlements.map((dueSettlement) => (
            <div
              key={dueSettlement._id}
              className="bg-gray-200 p-4 mb-4 rounded-md shadow"
            >
              <p className="text-lg font-semibold">
                Date: {format(new Date(dueSettlement.date), "dd-MM-yyyy")}
              </p>
              <p className="text-lg font-semibold">
                Total Due: ₹{dueSettlement.dueAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyCollectionSettlementPage;
