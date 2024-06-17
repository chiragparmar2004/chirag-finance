import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ collectedAmount, totalAmount }) => {
  const data = {
    labels: ["Collected", "Remaining"],
    datasets: [
      {
        data: [collectedAmount, totalAmount - collectedAmount],
        backgroundColor: ["#28a745", "#f50f0f"], // Example colors
        borderWidth: 1,
        borderRadius: 30,
        spacing: 3,
        cutout: 105,
        dataVisibility: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
