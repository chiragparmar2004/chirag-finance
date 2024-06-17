import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { format, parseISO } from "date-fns";
import DoughnutChart from "../../components/Charts/DoughnutChart";

const MemberLoanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [member, setMember] = useState("");
  const [filter, setFilter] = useState("Pending");

  const handleLoanClick = (id) => {
    navigate(`/loan/${id}`);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await apiRequest().get(`/loan/loans/${id}/${filter}`);
        console.log(response);
        setLoans(response.data.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    const fetchMember = async () => {
      try {
        const response = await apiRequest().get(`/user/${id}`);
        setMember(response.data.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    fetchLoans();
    fetchMember();
  }, [id, filter]);

  return (
    <div className=" mx-auto py-8">
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

      {/* List of filtered loans */}
      <div className="  p-4 rounded-lg">
        <ul>
          {loans.length > 0 ? (
            loans.map((loan) => {
              const startDate = parseISO(loan.startDate);
              const endDate = parseISO(loan.endDate);

              const paymentProgress = Math.min(
                (loan.collectedMoney / loan.amount) * 100,
                100
              );

              return (
                <li
                  key={loan._id}
                  className="border-gray-200 py-4 cursor-pointer bg-white mb-4 rounded-lg p-4 shadow-md transition-transform "
                  onClick={() => handleLoanClick(loan._id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
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
                    <div className=" ">
                      <DoughnutChart
                        collectedAmount={loan.collectedMoney}
                        totalAmount={loan.amount}
                      />
                    </div>
                  </div>
                  {/* <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Payment Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round(paymentProgress)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      
                      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                          style={{ width: `${paymentProgress}%` }}
                          className="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div> */}
                </li>
              );
            })
          ) : (
            <p className="text-white">No paid loans for this member.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MemberLoanPage;
