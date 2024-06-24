import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";
import { format, parseISO } from "date-fns";
import { ThreeDots } from "react-loader-spinner"; // Importing the ThreeDots loader

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [date, setDate] = useState("");
  const [totalCollection, setTotalCollection] = useState(0);
  const [name, setName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest().get("/payments/receivedPayments");
      setPayments(response.data.data);
      console.log("response data", response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setLoading(false);
    }
  };

  const fetchPaymentsByDate = async () => {
    try {
      setLoading(true);
      const response = await apiRequest().get(
        `/payments/paymentsByDate/${date}`,
        {
          params: {
            name,
            paymentType,
            minAmount,
            maxAmount,
          },
        }
      );

      if (response.data.success && response.data.data.length === 0) {
        setPayments([]);
        setTotalCollection(0);
        toast("No payments found for the selected date");
      } else {
        setPayments(response.data.data);
        setTotalCollection(response.data.totalCollection);
        toast.success("Payments fetched successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments by date:", error);
      setLoading(false);
      toast.error("Error fetching payments by date");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center px-6">
      <div className="w-full h-full mt-10 bg-[#454545] p-8 shadow-custom-inset rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Received Payments
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div>
            <label
              htmlFor="date"
              className="block text-gray-800 font-semibold text-sm"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-800 font-semibold text-sm"
            >
              Member Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                placeholder="Member Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="paymentType"
              className="block text-gray-800 font-semibold text-sm"
            >
              Payment Type
            </label>
            <div className="mt-2">
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              >
                <option value="">All</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="minAmount"
              className="block text-gray-800 font-semibold text-sm"
            >
              Min Amount
            </label>
            <div className="mt-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                id="minAmount"
                placeholder="Min Amount"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="maxAmount"
              className="block text-gray-800 font-semibold text-sm"
            >
              Max Amount
            </label>
            <div className="mt-2">
              <input
                id="maxAmount"
                placeholder="Max Amount"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <button
              onClick={fetchPaymentsByDate}
              className="block mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Loading..." : "Apply Filter"}
            </button>
          </div>
        </div>
        <div className="bg-[#e0e0e0]  border flex  flex-col items-center justify-center p-3  rounded-lg ">
          <h2 className="text-2xl font-bold mb-2">
            Total Collection for{" "}
            {date ? format(parseISO(date), "dd-MM-yyyy") : ""}
          </h2>
          <p className="text-3xl">₹{totalCollection}</p>
        </div>
      </div>
      <div className="w-full bg-white p-8 shadow-md rounded-md">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#418fff"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No payments found for the selected date.
            </p>
            <img
              src="/no_data2.jpg"
              alt="No data"
              height={200}
              width={200}
              className="mx-auto mt-4"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        ) : (
          <div className="">
            <table className="w-full text-lg text-left bg-[#1e1e1e] ">
              <thead className="text-xl text-white text-center border-l  uppercase bg-[#1e1e1e]">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-r border-l border-t border-black"
                  >
                    Serial No.
                  </th>

                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-r border-l border-t border-black"
                  >
                    Member Name
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-r border-l border-t border-black"
                  >
                    EMI Amount
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-r border-l border-t border-black"
                  >
                    Payment Method
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 border-b border-r border-l border-t border-black"
                  >
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className={
                      "bg-[#454545] shadow-custom-inset   text-black text-2xl text-center"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-black border-b border-r border-l border-black">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 border-b border-r border-black">
                      {payment.loan.member.name}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
                      ₹{payment.amount}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
                      {payment.paymentType}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-black">
                      {format(parseISO(payment.date), "dd-MM-yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
