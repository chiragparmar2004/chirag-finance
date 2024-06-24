import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { format, parseISO } from "date-fns";
import { ThreeDots } from "react-loader-spinner"; // Importing the ThreeDots loader

const MemberLoanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [member, setMember] = useState("");
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(true); // Loading state

  const handleLoanClick = (id) => {
    navigate(`/loan/${id}`);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiRequest().get(`/loan/loans/${id}/${filter}`);
        setLoans(response.data.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    const fetchMember = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiRequest().get(`/user/${id}`);
        setMember(response.data.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchLoans();
    fetchMember();
  }, [id, filter]);

  const calculatePercentage = (collected, total) => {
    return Math.min((collected / total) * 100, 100);
  };

  return (
    <div className="mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Active Loans for{" "}
        <span className="text-3xl text-[#0085ff]">{member.name}</span>
      </h1>
      <div className="flex space-x-2 rounded-xl select-none mb-4">
        <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="Pending"
            className="peer hidden"
            checked={filter === "Pending"}
            onChange={handleFilterChange}
          />
          <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#fdfbfe] peer-checked:to-[#ffffff] peer-checked:text-black text-white p-2 rounded-lg transition duration-150 ease-in-out peer-checked:animate-gradient">
            Pending
          </span>
        </label>
        <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="Paid"
            className="peer hidden"
            checked={filter === "Paid"}
            onChange={handleFilterChange}
          />
          <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#fdfbfe] peer-checked:to-[#ffffff] peer-checked:text-black text-white p-2 rounded-lg transition duration-150 ease-in-out peer-checked:animate-gradient">
            Paid
          </span>
        </label>
        <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="All"
            className="peer hidden"
            checked={filter === "All"}
            onChange={handleFilterChange}
          />
          <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#fdfbfe] peer-checked:to-[#ffffff] peer-checked:text-black text-white p-2 rounded-lg transition duration-150 ease-in-out peer-checked:animate-gradient">
            All
          </span>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#418fff"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div className="p-4 rounded-lg">
          <ul>
            {loans.length > 0 ? (
              loans.map((loan) => {
                const startDate = parseISO(loan.startDate);
                const endDate = parseISO(loan.endDate);
                const paymentProgress = calculatePercentage(
                  loan.collectedMoney,
                  loan.amount
                );

                return (
                  <li
                    key={loan._id}
                    className="border-gray-200 py-4 cursor-pointer bg-white mb-4 rounded-lg p-4 shadow-md transition-transform"
                    onClick={() => handleLoanClick(loan._id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <h3 className="text-2xl font-semibold text-black mb-1">
                          Loan ID: {loan._id}
                        </h3>
                        <p className="text-gray-600">
                          Start Date: {format(startDate, "dd-MM-yyyy")}
                        </p>
                        <p className="text-gray-600">
                          End Date: {format(endDate, "dd-MM-yyyy")}
                        </p>
                        <p className="text-xl text-black mt-2">
                          Amount: ₹{loan.amount}
                        </p>
                        <p className="text-xl text-black mt-2">
                          Interest Amount: ₹{loan.interest}
                        </p>
                      </div>
                      <div
                        className={`flex items-center justify-center w-40 h-40 border-2 ${
                          paymentProgress === 100
                            ? "bg-green-500 text-white"
                            : "border-black text-black"
                        } font-bold text-xl rounded-full relative`}
                      >
                        <span className="absolute">{`${paymentProgress}%`}</span>
                        <svg className="absolute w-full h-full">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            fill="none"
                            strokeWidth="8"
                            strokeDasharray={`${paymentProgress} ${
                              100 - paymentProgress
                            }`}
                            strokeDashoffset="25"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-black">No loans found for this member.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MemberLoanPage;
