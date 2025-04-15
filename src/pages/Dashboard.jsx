import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/api/tickets/dashboard/summary");
        setData(response.data);
        console.log("📊 Dashboard Data:", response.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <div className="text-center mt-10 text-white">Loading Dashboard...</div>;

  const { totals, priorities, types, monthlyTrends } = data;

  const statusData = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        label: "Ticket Status",
        data: [totals.openTickets, totals.closedTickets],
        backgroundColor: ["#34d399", "#facc15"],
      },
    ],
  };

  const priorityData = {
    labels: priorities.map(p => p.priority || "Unspecified"),
    datasets: [
      {
        label: "By Priority",
        data: priorities.map(p => p.count),
        backgroundColor: ["#60a5fa", "#f87171", "#fbbf24", "#34d399"],
      },
    ],
  };

  const typeData = {
    labels: types.map(t => t.type || "Unspecified"),
    datasets: [
      {
        label: "By Type",
        data: types.map(t => t.count),
        backgroundColor: ["#a78bfa", "#38bdf8", "#fb7185", "#4ade80"],
      },
    ],
  };

  const monthlyData = {
    labels: monthlyTrends.map(m => m.month),
    datasets: [
      {
        label: "count",
        data: monthlyTrends.map(m => m.count),
        borderColor: "#38bdf8",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-600 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Tickets</h2>
          <p className="text-2xl">{totals.totalTickets}</p>
        </div>
        <div className="bg-green-500 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Open Tickets</h2>
          <p className="text-2xl">{totals.openTickets}</p>
        </div>
        <div className="bg-yellow-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Closed Tickets</h2>
          <p className="text-2xl">{totals.closedTickets}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg">
          <h2 className="text-md font-semibold mb-2">🎯 Ticket Status</h2>
          <Pie data={statusData} />
        </div>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg">
          <h2 className="text-md font-semibold mb-2">📌 Tickets by Priority</h2>
          <Pie data={priorityData} />
        </div>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg">
          <h2 className="text-md font-semibold mb-2">📁 Tickets by Type</h2>
          <Pie data={typeData} />
        </div>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg">
          <h2 className="text-md font-semibold mb-2">📈 Monthly Ticket Trends</h2>
          <Line data={monthlyData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
