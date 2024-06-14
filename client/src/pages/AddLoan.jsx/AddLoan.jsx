import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

const AddLoan = ({ onSubmit }) => {
  const [members, setMembers] = useState([]);
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    amount: "",
    interest: "",
    startDate: "",
    endDate: "",
  });
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiRequest().get("/user/allMembers");
        setMembers(response.data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setMemberSuggestions([]);
      return;
    }

    const filteredSuggestions = members.filter((member) =>
      member.name.toLowerCase().includes(debouncedInput.toLowerCase())
    );
    setMemberSuggestions(filteredSuggestions);
  }, [debouncedInput, members]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      const endDate = new Date(value);
      endDate.setDate(endDate.getDate() + 100);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        endDate: endDate.toISOString().slice(0, 10),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      if (name === "memberName") {
        setDebouncedInput(value);
      }
    }
  };

  const handleMemberSelection = (selectedMember) => {
    setFormData({
      ...formData,
      memberId: selectedMember._id,
      memberName: selectedMember.name,
    });
    setMemberSuggestions([]);
  };

  const handleAmountOptionClick = (amount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: amount.toString(),
    }));
  };

  const defaultAmountOptions = [10000, 15000, 20000]; // Define default amount options here

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { memberId, amount, interest, startDate } = formData;
      const response = await apiRequest().post(`/loan/${memberId}`, {
        amount,
        interest,
        startDate,
      });

      if (response.status === 201) {
        alert("Loan added successfully!");
        setFormData({
          memberId: "",
          memberName: "",
          amount: "",
          interest: "",
          startDate: "",
          endDate: "",
        });
      } else {
        alert("Failed to add loan. Please try again.");
      }
    } catch (error) {
      console.error("Error adding loan:", error);
      alert("Failed to add loan. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Loan</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Member Name
            </label>
            <input
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter member name"
            />
            {memberSuggestions.length > 0 && (
              <ul className="mt-1 bg-white border rounded border-gray-300 shadow-md absolute w-full z-10">
                {memberSuggestions.map((member) => (
                  <li
                    key={member._id}
                    className="cursor-pointer py-1 px-3 hover:bg-blue-200"
                    onClick={() => handleMemberSelection(member)}
                  >
                    {member.name}
                  </li>
                ))}
              </ul>
            )}
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
              className="appearance-none border rounded w-full py-2 px-3 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter custom amount"
            />
            <div className="flex mt-2">
              {defaultAmountOptions.map((option) => (
                <div
                  key={option}
                  className="cursor-pointer bg-white hover:bg-blue-400 border border-blue-400 rounded px-3 py-1 mr-2"
                  onClick={() => handleAmountOptionClick(option)}
                >
                  ₹{option}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Interest
            </label>
            <input
              type="text"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter interest amount"
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled
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
    </div>
  );
};

export default AddLoan;
