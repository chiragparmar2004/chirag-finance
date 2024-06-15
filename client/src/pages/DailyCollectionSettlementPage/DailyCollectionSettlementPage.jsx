import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";
import { format, parseISO } from "date-fns";

const DailyCollectionSettlementPage = () => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd")); // Set default date to today
  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [gpayAmount, setGpayAmount] = useState(0);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettlements();
    fetchPaymentsByDate(date);
  }, [date]);

  const fetchSettlements = async () => {
    try {
      const response = await apiRequest().get("/settlement");
      setSettlements(response.data.data);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      toast.error("Error fetching settlements");
    }
  };

  const fetchPaymentsByDate = async (selectedDate) => {
    try {
      setLoading(true);
      const response = await apiRequest().get(
        `/payments/paymentsByDate/${selectedDate}`
      );

      if (response.data.success && response.data.data.length === 0) {
        toast("No payments found for the selected date");
        setTotalAmountDue(0);
      } else {
        setTotalAmountDue(response.data.totalCollection);
        toast.success("Payments fetched successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments by date:", error);
      setLoading(false);
      toast.error("Error fetching payments by date");
    }
  };

  const handleCreateSettlement = async () => {
    try {
      const response = await apiRequest().post("/settlement/create", {
        date,
        totalAmountDue,
        cashAmount,
        gpayAmount,
      });

      setSettlements([...settlements, response.data.data]);
      toast.success("Settlement created successfully");
      setCashAmount(0);
      setGpayAmount(0);
    } catch (error) {
      console.error("Error creating settlement:", error);
      toast.error("Error creating settlement");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center  justify-center">
      <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded-md mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Daily Collection Settlement
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-200 p-6 rounded-md">
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
                  onChange={(e) => setCashAmount(e.target.value)}
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
                  onChange={(e) => setGpayAmount(e.target.value)}
                  className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                onClick={handleCreateSettlement}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? "Loading..." : "Create Settlement"}
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-2">Settlements</h2>
            <div className="overflow-auto max-h-96">
              {settlements.map((settlement) => (
                <div
                  key={settlement._id}
                  className="bg-blue-200 p-4 mb-4 rounded-md shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-black text-2xl">
                      {format(parseISO(settlement.date), "dd-MM-yyyy")}
                    </p>
                    <p className="text-lg font-semibold">
                      Total Due: ₹{settlement.totalAmountDue}
                    </p>
                    <p className="text-lg font-semibold">
                      Amount Received: ₹{settlement.amountReceived}
                    </p>
                    <p className="text-lg font-semibold">
                      Cash: ₹{settlement.cashAmount}
                    </p>
                    <p className="text-lg font-semibold">
                      GPay: ₹{settlement.gpayAmount}
                    </p>
                    <p className="text-lg font-semibold">
                      Due Amount: ₹{settlement.dueAmount}
                    </p>
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCollectionSettlementPage;
