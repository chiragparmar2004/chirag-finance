import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [recentSettlements, setRecentSettlements] = useState([]);
  const [membersWithPendingEMIs, setMembersWithPendingEMIs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await apiRequest().get("/dashboard/summary");
        const loansResponse = await apiRequest().get("/dashboard/recentLoans");
        const settlementsResponse = await apiRequest().get(
          "/dashboard/recentSettlements"
        );
        // console.log(loansResponse);
        setSummary(summaryResponse.data);
        setRecentLoans(loansResponse.data);
        setRecentSettlements(settlementsResponse.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMembersWithPendingEMIs = async () => {
      try {
        const response = await apiRequest().get("/loan/memberList/pendingEmi");
        console.log(response.data);
        setMembersWithPendingEMIs(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching members with pending EMIs:",
          error.message
        );
        toast.error("Error fetching members with pending EMIs.");
      }
    };

    fetchMembersWithPendingEMIs();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full w-full">
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
    );
  if (error) return <div className="text-center mt-8">Error: {error}</div>;

  const interestHistoryData = summary?.interestHistory || [];

  console.log(interestHistoryData, "interest  history data");

  const chartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Interest Earned",
        data: interestHistoryData.map((entry) => entry.amount || 0),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: interestHistoryData.map((entry) =>
          format(new Date(entry.date), "dd-MM-yyyy")
        ),
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      {/* Dashboard Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <DashboardCard
              title="Total Loan Given"
              value={`₹${summary?.totalLoanGiven}`}
            />
            <DashboardCard
              title="Total Repayment"
              value={`₹${summary?.totalRepayment}`}
            />
            <DashboardCard title="Cash" value={`₹${summary?.cash}`} />
            <DashboardCard title="Bank" value={`₹${summary?.bank}`} />
            <DashboardCard
              title="Today Due"
              value={`₹${summary?.totalDueAmount}`}
            />
            <DashboardCard
              title="Interest Earned"
              value={`₹${summary?.totalInterestEarned}`}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center">
            <div className="w-full">
              <Card>
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
                >
                  <div className="w-max rounded-lg bg-gray-900 p-5 text-white ml-5">
                    <Square3Stack3DIcon className="h-6 w-6 " />
                  </div>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Interest Earned Over Time
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="max-w-sm font-normal"
                    >
                      Visualize the interest earned over time.
                    </Typography>
                  </div>
                </CardHeader>
                <CardBody className="px-2 pb-0">
                  <Chart {...chartConfig} />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Loans</h2>
          {recentLoans.length > 0 ? (
            <table className="text-center text-xl w-full">
              <thead className="bg-[#1e1e1e] flex text-white w-full rounded-t-md">
                <tr className="flex w-full">
                  <th className="py-3 px-4 w-1/3">Member Name</th>
                  <th className="py-3 px-4 w-1/3">Start Date</th>
                  <th className="py-3 px-4 w-1/3">Amount </th>
                </tr>
              </thead>
              <tbody className="bg-gray-100 flex flex-col items-center justify-between w-full">
                {recentLoans.map((loan, index) => (
                  <tr
                    key={index}
                    className="flex w-full text-gray-900 border-b border-gray-200 hover:bg-gray-200"
                  >
                    <td className="py-3 px-4 w-1/3 ">{loan.member.name}</td>
                    <td className="py-3 px-4 w-1/3">
                      {format(new Date(loan.startDate), "dd-MM-yyyy")}
                    </td>
                    <td className="py-3 px-4 w-1/3">₹{loan.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-4">No recent loans available.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Settlements</h2>
          {recentSettlements.length > 0 ? (
            <>
              <table className="text-center w-full text-xl">
                <thead className="bg-[#1e1e1e] flex text-white w-full rounded-t-md">
                  <tr className="flex w-full ">
                    <th className="py-3 px-4 w-1/3">Date</th>
                    <th className="py-3 px-4 w-1/3">Status</th>
                    <th className="py-3 px-4 w-1/3">Type</th>
                  </tr>
                </thead>
                <tbody
                  className={`bg-gray-100 flex flex-col items-center justify-between w-full ${
                    recentSettlements.length > 5
                      ? "overflow-y-scroll max-h-72"
                      : ""
                  }`}
                >
                  {recentSettlements.map((settlement, index) => (
                    <tr
                      key={index}
                      className="flex w-full text-gray-900 border-b border-gray-200 hover:bg-gray-200"
                    >
                      <td className="py-3 px-4 w-1/3">
                        {format(new Date(settlement.date), "dd-MM-yyyy")}
                      </td>
                      <td className={`py-3 px-4 w-1/3  `}>
                        <span
                          className={
                            settlement.totalAmountDue ===
                            settlement.amountReceived
                              ? "text-green-600 px-2 py-1 bg-green-200  rounded-full text-sm "
                              : "text-red-600 px-2 py-1 bg-red-200  rounded-full text-sm"
                          }
                        >
                          {settlement.totalAmountDue ===
                          settlement.amountReceived
                            ? "Settled"
                            : "Not Settled"}
                        </span>
                      </td>
                      <td className="py-3 px-4 w-1/3">
                        {settlement.paymentType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="text-gray-500 mt-4">
              No recent settlements available.
            </p>
          )}
        </div>
      </div>

      {/* Members with Pending EMIs */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">
          Members with Pending EMIs
        </h2>
        {membersWithPendingEMIs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="text-center w-full text-xl">
              <thead className="bg-[#1e1e1e] flex text-white w-full rounded-t-md">
                <tr className="flex w-full">
                  <th className="py-3 px-4 w-1/3">Name</th>
                  <th className="py-3 px-4 w-1/3">Loan Amount</th>
                  <th className="py-3 px-4 w-1/3">Received EMIs Until</th>
                </tr>
              </thead>
              <tbody
                className={`bg-gray-100 flex flex-col items-center justify-between w-full ${
                  membersWithPendingEMIs.length > 5
                    ? "overflow-y-scroll max-h-72"
                    : ""
                }`}
              >
                {membersWithPendingEMIs.map((loan, index) => (
                  <tr
                    key={index}
                    className="flex w-full text-gray-900 border-b border-gray-200 hover:bg-gray-200"
                  >
                    <td className="py-3 px-4 w-1/3 flex items-center justify-center">
                      <div className="flex items-center">
                        {/* <img
                          src={loan.member.profilePicture}
                          alt={loan.member.name}
                          className="w-10 h-10 rounded-full mr-2"
                        /> */}
                        <span className="ml-2">{loan.member.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 w-1/3">{loan.amount}</td>
                    <td className="py-3 px-4 w-1/3">
                      {format(
                        new Date(loan.receivedEMIsTillDate),
                        "dd-MM-yyyy"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            No members with pending EMIs found.
          </p>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className="bg-slate-300 p-4 rounded-lg shadow-md flex flex-col items-center">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-2xl">{value}</p>
  </div>
);

export default Dashboard;

// const Dashboard = () => {
//   const [summary, setSummary] = useState(null);
//   const [recentLoans, setRecentLoans] = useState([]);
//   const [recentSettlements, setRecentSettlements] = useState([]);
//   const [membersWithPendingEMIs, setMembersWithPendingEMIs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const summaryResponse = await apiRequest().get("/dashboard/summary");
//         const loansResponse = await apiRequest().get("/dashboard/recentLoans");
//         const settlementsResponse = await apiRequest().get(
//           "/dashboard/recentSettlements"
//         );
//         setSummary(summaryResponse.data);
//         setRecentLoans(loansResponse.data);
//         setRecentSettlements(settlementsResponse.data);
//       } catch (error) {
//         setError(error.response ? error.response.data.message : error.message);
//         toast.error("Error fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchMembersWithPendingEMIs = async () => {
//       try {
//         const response = await apiRequest().get("/loan/memberList/pendingEmi");
//         setMembersWithPendingEMIs(response.data.data);
//       } catch (error) {
//         console.error(
//           "Error fetching members with pending EMIs:",
//           error.message
//         );
//         toast.error("Error fetching members with pending EMIs.");
//       }
//     };

//     fetchMembersWithPendingEMIs();
//   }, []);

//   if (loading) return <div className="text-center mt-8">Loading...</div>;
//   if (error) return <div className="text-center mt-8">Error: {error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Summary</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <DashboardCard
//               title="Total Loan Given"
//               value={`₹${summary?.totalLoanGiven || 0}`}
//             />
//             <DashboardCard
//               title="Total Repayment"
//               value={`₹${summary?.totalRepayment || 0}`}
//             />
//             <DashboardCard title="Cash" value={`₹${summary?.cash || 0}`} />
//             <DashboardCard title="Bank" value={`₹${summary?.bank || 0}`} />
//             <DashboardCard
//               title="Today Due"
//               value={`₹${summary?.totalDueAmount || 0}`}
//             />
//             <DashboardCard
//               title="Interest Earned"
//               value={`₹${summary?.totalInterestEarned || 0}`}
//             />
//           </div>
//         </div>

// </div>

//       {/* Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Recent Loans</h2>
//           {recentLoans.length > 0 ? (
//             <table className="text-center text-xl w-full">
//               <thead className="bg-[#1e1e1e] flex text-white w-full rounded-t-md">
//                 <tr className="flex w-full">
//                   <th className="py-3 px-4 w-1/3">Member Name</th>
//                   <th className="py-3 px-4 w-1/3">Start Date</th>
//                   <th className="py-3 px-4 w-1/3">Loan Amount (₹)</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-gray-100 flex flex-col items-center justify-between w-full">
//                 {recentLoans.map((loan, index) => (
//                   <tr
//                     key={index}
//                     className="flex w-full text-gray-900 border-b border-gray-200 hover:bg-gray-200"
//                   >
//                     <td className="py-3 px-4 w-1/3 ">{loan.member.name}</td>
//                     <td className="py-3 px-4 w-1/3">
//                       {format(new Date(loan.startDate), "dd-MM-yyyy")}
//                     </td>
//                     <td className="py-3 px-4 w-1/3">₹{loan.amount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-gray-500 mt-4">No recent loans available.</p>
//           )}
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Recent Settlements</h2>
//           {recentSettlements.length > 0 ? (
//             <>
//               <table className="text-center w-full text-xl">
//                 <thead className="bg-[#1e1e1e] flex text-white w-full rounded-t-md">
//                   <tr className="flex w-full ">
//                     <th className="py-3 px-4 w-1/3">Date</th>
//                     <th className="py-3 px-4 w-1/3">Status</th>
//                     <th className="py-3 px-4 w-1/3">Amount (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-gray-100 flex flex-col items-center justify-between w-full">
//                   {recentSettlements.map((settlement, index) => (
//                     <tr
//                       key={index}
//                       className="flex w-full text-gray-900 border-b border-gray-200 hover:bg-gray-200"
//                     >
//                       <td className="py-3 px-4 w-1/3">
//                         {format(new Date(settlement.date), "dd-MM-yyyy")}
//                       </td>
//                       <td className="py-3 px-4 w-1/3">{settlement.status}</td>
//                       <td className="py-3 px-4 w-1/3">₹{settlement.amount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </>
//           ) : (
//             <p className="text-gray-500 mt-4">
//               No recent settlements available.
//             </p>
//           )}
//         </div>

//         {/* Members with Pending EMIs */}
//         <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//           <h2 className="text-2xl font-semibold mb-4">
//             Members with Pending EMIs
//           </h2>
//           {membersWithPendingEMIs.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="text-center w-full text-xl">
//                 <thead className="bg-[#1e1e1e] flex text-white w-full rounded-t-md">
//                   <tr className="flex w-full">
//                     <th className="py-3 px-4 w-1/3">Name</th>
//                     <th className="py-3 px-4 w-1/3">Loan Amount</th>
//                     <th className="py-3 px-4 w-1/3">Received EMIs Until</th>
//                   </tr>
//                 </thead>
//                 <tbody
//                 // className={bg-gray-100 flex flex-col items-center justify-between w-full ${
//                 //   membersWithPendingEMIs.length > 5
//                 //     ? "overflow-y-scroll max-h-72"
//                 //     : ""
//                 // }}
//                 >
//                   {membersWithPendingEMIs.map((loan, index) => (
//                     <tr
//                       key={index}
//                       className="flex w-full text-gray-900 border-b border-gray-200 hover:bg-gray-200"
//                     >
//                       <td className="py-3 px-4 w-1/3 flex items-center justify-center">
//                         <img
//                           src={loan.member.profilePicture}
//                           alt={loan.member.name}
//                           className="w-10 h-10 rounded-full mr-2 flex items-start justify-start"
//                         />

//                         {loan.member.name}
//                       </td>{" "}
//                       <td className="py-3 px-4 w-1/3">{loan.amount}</td>
//                       <td className="py-3 px-4 w-1/3">
//                         {format(
//                           new Date(loan.receivedEMIsTillDate),
//                           "dd-MM-yyyy"
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500 mt-4">
//               No members with pending EMIs found.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
