import React, { useState } from "react";

const AddLoan = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    startDate: "",
    endDate: "", // Initialize endDate as an empty string
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      // Calculate the end date 100 days after the start date
      const endDate = new Date(value);
      endDate.setDate(endDate.getDate() + 100);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        endDate: endDate.toISOString().slice(0, 10), // Convert to ISO string (YYYY-MM-DD format)
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Optionally, you can reset the form data after submission
    setFormData({
      memberId: "",
      amount: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Add Loan</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Member ID
          </label>
          <input
            type="text"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter member ID"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter loan amount"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled // Disable the end date input field as it's automatically set
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Loan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLoan;
