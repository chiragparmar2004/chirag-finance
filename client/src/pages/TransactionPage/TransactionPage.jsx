import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { format } from "date-fns";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiRequest().get("/transaction-history");
        setTransactions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transaction history");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <table className="w-full text-lg text-left bg-[#1e1e1e]">
        <caption className="p-5 text-2xl font-semibold text-left text-white">
          Transaction History
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            Explore your transaction records to stay updated with your financial
            transactions.
          </p>
        </caption>
        <thead className="text-xl text-white text-center uppercase bg-[#1e1e1e]">
          <tr>
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
              Amount
            </th>
            <th
              scope="col"
              className="py-3 px-4 border-b border-r border-black"
            >
              Type
            </th>
            <th
              scope="col"
              className="py-3 px-4 border-b border-r border-black"
            >
              Purpose
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={transaction._id}
              className="bg-[#454545] shadow-custom-inset text-black text-2xl text-center"
            >
              <td className="px-4 py-3 border-b border-r border-black">
                {format(new Date(transaction.date), "dd/MM/yyyy")}
              </td>
              <td className="px-4 py-3 border-b border-r border-black">
                {transaction.amount}
              </td>
              <td className="px-4 py-3 border-b border-r border-black">
                {transaction.type}
              </td>
              <td className="px-4 py-3 border-b border-r border-black">
                {transaction.purpose}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionPage;
