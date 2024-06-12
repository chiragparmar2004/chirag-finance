import React, { useState } from "react";
import Modal from "react-modal";

const AddEmiModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [emiAmount, setEmiAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = () => {
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add EMI</h2>
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
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="GPay">GPay</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEmiModal;
