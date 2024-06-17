import React, { useState } from "react";
import toast from "react-hot-toast";

const RenewLoanModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [newLoanAmount, setNewLoanAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [paymentType, setPaymentType] = useState("cash");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newLoanAmount || !interest || !startDate) {
      toast.error("Please fill in all the fields");
      return;
    }
    onSubmit(newLoanAmount, interest, startDate, paymentType);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">Renew Loan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label
              htmlFor="newLoanAmount"
              className="block text-sm font-medium text-gray-700"
            >
              New Loan Amount
            </label>
            <input
              id="newLoanAmount"
              type="text"
              inputMode="numeric"
              value={newLoanAmount}
              onChange={(e) => setNewLoanAmount(e.target.value)}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="interest"
              className="block text-sm font-medium text-gray-700"
            >
              Interest
            </label>
            <input
              id="interest"
              type="text"
              inputMode="numeric"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="paymentType"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Type
            </label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="cash">Cash</option>
              <option value="gpay">GPay</option>
            </select>
          </div>
          <div className="flex gap-5">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Submit
            </button>
            <button
              onClick={onRequestClose}
              className="w-full bg-gray-400 text-white px-6 py-2 rounded-lg border-gray-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewLoanModal;
