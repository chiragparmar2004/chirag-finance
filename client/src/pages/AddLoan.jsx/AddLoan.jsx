import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
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
        toast.success("Loan Added Successfully");
        setFormData({
          memberId: "",
          memberName: "",
          amount: "",
          interest: "",
          startDate: "",
          endDate: "",
        });
        navigate("/");
      } else {
        toast.error("Failed to add loan. Please try again.");
      }
    } catch (error) {
      console.error("Error adding loan:", error);
      toast.error("Failed to add loan. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Add Loan
        </h1>
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter member name"
            />
            {memberSuggestions.length > 0 && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10">
                {memberSuggestions.map((member) => (
                  <li
                    key={member._id}
                    className="cursor-pointer py-2 px-3 hover:bg-blue-100"
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom amount"
            />
            <div className="flex mt-2 space-x-2">
              {defaultAmountOptions.map((option) => (
                <div
                  key={option}
                  className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded px-3 py-1"
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
