import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import { format } from "date-fns";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await apiRequest().get("/payments/receivedPayments");
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchPaymentsByDate = async () => {
    try {
      const response = await apiRequest().get(
        `/payments/paymentsByDate/${date}`
      );
      if (response.data.success && response.data.data.length === 0) {
        setMessage("No payments found for the selected date");
        setPayments([]);
      } else {
        setPayments(response.data.data);
        setMessage(""); // Clear the message if payments are found
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("No payments found for the selected date");
        setPayments([]);
      } else {
        console.error("Error fetching payments by date:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Received Payments
        </h1>
        <div className="flex items-center mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
          />
          <button
            onClick={fetchPaymentsByDate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Filter by Date
          </button>
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <ul className="space-y-4">
          {payments.map((payment) => (
            <li
              key={payment._id}
              className="bg-gray-50 p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">₹{payment.amount}</p>
                <p className="text-gray-500">
                  {/* {new Date(payment.date).toLocaleDateString()} */}
                  {format(payment.date, "dd-MM-yyyy")}
                </p>
                <p className="text-gray-500">{payment.paymentType}</p>
                <p className="text-gray-500">
                  Member: {payment.loan.member.name}
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src={payment.loan.member.profilePicture}
                  alt={payment.loan.member.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentsPage;
