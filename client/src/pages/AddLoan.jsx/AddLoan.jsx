import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddLoan = () => {
  const [members, setMembers] = useState([]);
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    amount: "",
    interest: "",
    startDate: "",
    endDate: "",
    paymentType: "",
  });
  const [debouncedInput, setDebouncedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
    setHighlightedIndex(-1); // Reset the highlighted index when suggestions change
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
    setHighlightedIndex(-1); // Reset the highlighted index
  };

  const handleAmountOptionClick = (amount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: amount.toString(),
    }));
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (memberSuggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          prevIndex < memberSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : memberSuggestions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission on Enter
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < memberSuggestions.length
        ) {
          handleMemberSelection(memberSuggestions[highlightedIndex]);
        }
      }
    },
    [highlightedIndex, memberSuggestions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const defaultAmountOptions = [10000, 15000, 20000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.memberId ||
      !formData.amount ||
      !formData.interest ||
      !formData.startDate ||
      !formData.paymentType
    ) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    const loadingToast = toast.loading("Adding Loan...");
    try {
      const { memberId, amount, interest, startDate, paymentType } = formData;
      const response = await apiRequest().post(`/loan/addLoan/${memberId}`, {
        amount,
        interest,
        startDate,
        paymentType,
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
          paymentType: "",
        });
        navigate("/home_page");
      } else {
        const errorMessage =
          response.data?.message || "Failed to add loan. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error adding loan:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add loan. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-[#454545] shadow-custom-inset rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Add Loan
        </h1>
        <form onSubmit={handleSubmit} className="text-black">
          <div className="mb-4 relative">
            <div className="flex flex-col-reverse w-full">
              <input
                type="text"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                placeholder="Enter member name"
              />
              <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                Member Name
              </span>
            </div>
            {memberSuggestions.length > 0 && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10">
                {memberSuggestions.map((member, index) => (
                  <li
                    key={member._id}
                    className={`cursor-pointer py-2 px-3 hover:font-bold ${
                      highlightedIndex === index ? "bg-gray-300" : ""
                    }`}
                    onClick={() => handleMemberSelection(member)}
                  >
                    {member.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4 relative">
            <div className="flex flex-col-reverse w-full">
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                placeholder="Enter custom amount"
              />
              <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                Amount
              </span>
            </div>
            <div className="flex space-x-2 border-[1px] border-black rounded-md select-none mt-2">
              {defaultAmountOptions.map((option) => (
                <label
                  key={option}
                  className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="amountOption"
                    value={option}
                    className="peer hidden"
                    checked={formData.amount === option.toString()}
                    onChange={() => handleAmountOptionClick(option)}
                  />
                  <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#080808] peer-checked:to-[#000000] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                    ₹{option}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4 relative">
            <div className="flex flex-col-reverse w-full">
              <input
                type="text"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                placeholder="Enter interest rate"
              />
              <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                Interest
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex mb-4  relative">
              <div className="flex flex-col-reverse w-full">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                />
                <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                  Start Date
                </span>
              </div>
            </div>
            <div className="flex mb-4 relative">
              <div className="flex flex-col-reverse w-full">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                  disabled
                />
                <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                  End Date
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 relative">
            <div className="flex space-x-2 border-[1px] border-black rounded-md select-none justify-around ">
              <label className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value="cash"
                  className="peer hidden"
                  checked={formData.paymentType === "cash"}
                  onChange={handleChange}
                />
                <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#080808] peer-checked:to-[#000000] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                  Cash
                </span>
              </label>
              <label className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value="gpay"
                  className="peer hidden"
                  checked={formData.paymentType === "gpay"}
                  onChange={handleChange}
                />
                <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#080808] peer-checked:to-[#000000] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                  GPay
                </span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoan;
