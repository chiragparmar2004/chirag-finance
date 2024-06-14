import React, { useState } from "react";

const AddEmiModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [emiAmount, setEmiAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(emiAmount);
    if (isNaN(amount) || amount <= 0 || !paymentMethod) {
      alert("Please enter a valid amount and select a payment method");
      return;
    }

    const paymentDate = new Date().toISOString();
    onSubmit(amount, paymentMethod, paymentDate);
    setEmiAmount("");
    setPaymentMethod("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50   flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add EMI</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              EMI Amount
            </label>
            <input
              type="number"
              value={emiAmount}
              onChange={(e) => setEmiAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter EMI amount"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="GPay">GPay</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            <button
              onClick={onRequestClose}
              className="ml-2 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmiModal;
