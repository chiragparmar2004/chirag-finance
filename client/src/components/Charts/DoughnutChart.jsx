import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

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
        cutout: 100,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      // Custom plugin to add text in the center
      beforeDraw: (chart) => {
        const {
          ctx,
          chartArea: { width, height },
        } = chart;
        ctx.save();
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        const text = `${collectedAmount} / ${totalAmount}`;
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();
      },
    },
  };

  return (
    <div className="flex justify-center items-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
