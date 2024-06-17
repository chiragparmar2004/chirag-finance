import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [recentSettlements, setRecentSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membersWithPendingEMIs, setMembersWithPendingEMIs] = useState([]);
  useEffect(() => {
    const fetchMembersWithPendingEMIs = async () => {
      try {
        const response = await apiRequest().get("/user/pendingEmi");
        console.log(response);
        setMembersWithPendingEMIs(response.data);
      } catch (error) {
        // Handle the error here
        console.error(
          "Error fetching members with pending EMIs:",
          error.message
        );
        toast.error("Error fetching members with pending EMIs");
      }
    };

    fetchMembersWithPendingEMIs();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await apiRequest().get("/dashboard/summary");
        const loansResponse = await apiRequest().get("/dashboard/recentLoans");
        const settlementsResponse = await apiRequest().get(
          "/dashboard/recentSettlements"
        );
        setSummary(summaryResponse.data);
        setRecentLoans(loansResponse.data);
        setRecentSettlements(settlementsResponse.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8">Error: {error}</div>;

  const lineData = {
    labels: recentLoans.map((loan) =>
      format(new Date(loan.startDate), "dd-MM-yyyy")
    ),
    datasets: [
      {
        label: "Loan Amount",
        data: recentLoans.map((loan) => loan.amount),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Recent Loans",
        font: {
          size: 18,
        },
      },
    },
  };

  const pieData = {
    labels: [
      "Total Loan Given",
      "Total Repayment",
      // "Cash",
      // "Bank",
      // "Today Due",
      // "Interest Earned",
    ],
    datasets: [
      {
        label: "Summary",
        data: [
          summary?.totalLoanGiven,
          summary?.totalRepayment,
          summary?.cash,
          summary?.bank,
          summary?.totalDueAmount,
          summary?.totalInterestEarned,
        ],
        backgroundColor: [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#FF6384",
          "#36A2EB",
        ],
        hoverBackgroundColor: [
          "#0077CC",
          "#00B284",
          "#E6AC27",
          "#E67333",
          "#FF5272",
          "#2C8FC7",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Summary Distribution",
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Loan Given</h3>
            <p className="text-2xl">₹{summary?.totalLoanGiven}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Repayment</h3>
            <p className="text-2xl">₹{summary?.totalRepayment}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Cash</h3>
            <p className="text-2xl">₹{summary?.cash}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Bank</h3>
            <p className="text-2xl">₹{summary?.bank}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Today Due</h3>
            <p className="text-2xl">₹{summary?.totalDueAmount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Interest Earned</h3>
            <p className="text-2xl">₹{summary?.totalInterestEarned}</p>
          </div>
        </div>
        {/* <div className="mt-6">
          <Pie data={pieData} options={pieOptions} />
        </div> */}
      </div>

      <div className="bg-white p-6 rounded-lg mb-6 flex flex-row gap-2">
        <div className="flex-1 bg-black">
          <Line data={lineData} options={lineOptions} />
        </div>

        <div className="flex-1 bg-blue-500 p-4">
          {recentLoans.length > 0 ? (
            <div className="w-[60%] gap-2">
              {recentLoans.map((loan, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md mb-4 flex items-center justify-between gap-2"
                >
                  <p className="text-lg">{loan.member.name}</p>
                  <p className="text-lg">
                    {format(new Date(loan.startDate), "dd-MM-yy")}
                  </p>
                  <p className="text-lg">₹{loan.amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent loans available.</p>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Settlements</h2>
        {recentSettlements.length > 0 ? (
          <div className="overflow-hidden rounded-lg">
            <table className="w-full bg-white border-collapse border border-gray-200">
              <thead className="bg-gray-200 text-gray-700 uppercase">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300">Date</th>
                  <th className="py-3 px-4 border-b border-gray-300">
                    Total Amount Due (₹)
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300">
                    Amount Received (₹)
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300">
                    Payment Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSettlements.map((settlement, index) => (
                  <tr
                    key={index}
                    className="text-gray-900 border-b border-gray-200"
                  >
                    <td className="py-3 px-4">
                      {format(new Date(settlement.date), "dd-MM-yyyy")}
                    </td>
                    <td className="py-3 px-4">{settlement.totalAmountDue}</td>
                    <td className="py-3 px-4">{settlement.amountReceived}</td>
                    <td className="py-3 px-4">{settlement.paymentType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No recent settlements available.</p>
        )}
      </div>
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Members with Pending EMIs
        </h2>
        {membersWithPendingEMIs.length > 0 ? (
          <div className="overflow-hidden rounded-lg">
            <table className="w-full bg-white border-collapse border border-gray-200">
              <thead className="bg-gray-200 text-gray-700 uppercase">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300">Name</th>
                  <th className="py-3 px-4 border-b border-gray-300">
                    Mobile Number
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300">Loans</th>
                </tr>
              </thead>
              <tbody>
                {membersWithPendingEMIs.map((member, index) => (
                  <tr
                    key={index}
                    className="text-gray-900 border-b border-gray-200"
                  >
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4">{member.mobileNumber}</td>
                    <td className="py-3 px-4">
                      {member.loans.map((loan, index) => (
                        <div key={index}>
                          <p>Loan Amount: {loan.amount}</p>
                          <p>
                            Received EMIs Until:{" "}
                            {format(
                              new Date(loan.receivedEMIsUntilDate),
                              "dd-MM-yyyy"
                            )}
                          </p>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No members with pending EMIs found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
