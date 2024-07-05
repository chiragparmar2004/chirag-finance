import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { format } from "date-fns";
import AddMoneyTransactionModal from "../../components/AddMoneyTransactionModal/AddMoneyTransactionModal";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    paymentType: "",
    minAmount: "",
    maxAmount: "",
  });

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

  const fetchFilteredTransactions = async () => {
    setLoading(true);
    try {
      const response = await apiRequest().get(
        "/user/moneyTransaction/filtered-transactions",
        {
          params: {
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            type: filters.type || undefined,
            paymentType: filters.paymentType || undefined,
            minAmount: filters.minAmount || undefined,
            maxAmount: filters.maxAmount || undefined,
          },
        }
      );
      // console.log(response);
      setTransactions(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch transaction history");
      setLoading(false);
    }
  };

  const handleAddTransaction = async (form) => {
    const response = await apiRequest().post("/user/addMoneyTransaction", form);
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      response.data.data,
    ]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredTransactions();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <form
        onSubmit={handleFilterSubmit}
        className="mt-4 bg-[#454545] p-8 shadow-custom-inset rounded-lg mb-8"
      >
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div>
            <label
              htmlFor="startDate"
              className="block text-gray-800 font-semibold text-sm"
            >
              Start Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-gray-800 font-semibold text-sm"
            >
              End Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-gray-800 font-semibold text-sm"
            >
              Type
            </label>
            <div className="mt-2">
              <select
                name="type"
                id="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              >
                <option value="">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
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
                name="paymentType"
                id="paymentType"
                value={filters.paymentType}
                onChange={handleFilterChange}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              >
                <option value="">All</option>
                <option value="cash">Cash</option>
                <option value="gpay">GPay</option>
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
                type="number"
                name="minAmount"
                id="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
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
                type="number"
                name="maxAmount"
                id="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="block mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
          </div>
        </div>
        {/* <button
          onClick={openModal}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Transaction
        </button> */}
      </form>

      <table className="w-full text-lg text-left bg-[#1e1e1e] mt-4">
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
            <th
              scope="col"
              className="py-3 px-4 border-b border-r border-black"
            >
              Payment Method
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
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
              <td className="px-4 py-3 border-b border-r border-black">
                {transaction.paymentType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <AddMoneyTransactionModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSubmit={handleAddTransaction}
      /> */}
    </div>
  );
};

export default TransactionPage;
