import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  // Dummy data
  const dummyData = {
    totalInvestment: 6000,
    remainingLoans: 4000,
    todaysCollection: 500,
    collectionByMethod: { Cash: 300, GPay: 200 },
    dailyCollection: [
      { date: "2024-05-20", amount: 100 },
      { date: "2024-05-21", amount: 200 },
      { date: "2024-05-22", amount: 150 },
      { date: "2024-05-23", amount: 50 },
      { date: "2024-05-24", amount: 300 },
    ],
  };

  const [totalInvestment, setTotalInvestment] = useState(0);
  const [remainingLoans, setRemainingLoans] = useState(0);
  const [todaysCollection, setTodaysCollection] = useState(0);
  const [collectionByMethod, setCollectionByMethod] = useState({
    Cash: 0,
    GPay: 0,
  });
  const [dailyCollection, setDailyCollection] = useState([]);

  useEffect(() => {
    // Simulate fetching data from backend by using dummy data
    setTotalInvestment(dummyData.totalInvestment);
    setRemainingLoans(dummyData.remainingLoans);
    setTodaysCollection(dummyData.todaysCollection);
    setCollectionByMethod(dummyData.collectionByMethod);
    setDailyCollection(dummyData.dailyCollection);
  }, []);

  const barData = {
    labels: dailyCollection.map((dc) => dc.date),
    datasets: [
      {
        label: "Daily Collection",
        data: dailyCollection.map((dc) => dc.amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Cash", "GPay"],
    datasets: [
      {
        data: [collectionByMethod.Cash, collectionByMethod.GPay],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Total Investment</h2>
          <p className="text-4xl text-blue-600">${totalInvestment}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Remaining Loans</h2>
          <p className="text-4xl text-green-600">${remainingLoans}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Today's Collection</h2>
          <p className="text-4xl text-red-600">${todaysCollection}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Daily Collection
          </h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Collection by Method
          </h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
