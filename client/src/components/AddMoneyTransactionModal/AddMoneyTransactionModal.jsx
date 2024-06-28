import { useState } from "react";

const AddMoneyTransactionModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [form, setForm] = useState({
    amount: "",
    type: "credit",
    purpose: "",
    paymentType: "cash",
  });
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(form);
      setForm({
        amount: "",
        type: "credit",
        purpose: "",
        paymentType: "cash",
      });
      setFormError("");
      onRequestClose();
    } catch (err) {
      setFormError("Failed to add transaction");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/2">
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="mt-8">
          {formError && <p className="text-red-500">{formError}</p>}
          <div className="mb-4">
            <label className="block text-black mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={form.purpose}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Payment Method</label>
            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="cash">Cash</option>
              <option value="gpay">gpay</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyTransactionModal;
