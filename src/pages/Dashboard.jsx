import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiList, FiPieChart } from "react-icons/fi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/tickets/dashboard/summary");
        setData(response.data);
        console.log("📊 Dashboard Data:", response.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data)
    return <div className="text-center mt-10 text-white">Loading Dashboard...</div>;

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
    labels: priorities.map((p) => p.priority || "Unspecified"),
    datasets: [
      {
        label: "By Priority",
        data: priorities.map((p) => p.count),
        backgroundColor: ["#60a5fa", "#f87171", "#fbbf24", "#34d399"],
      },
    ],
  };

  const typeData = {
    labels: types.map((t) => t.type || "Unspecified"),
    datasets: [
      {
        label: "By Type",
        data: types.map((t) => t.count),
        backgroundColor: ["#a78bfa", "#38bdf8", "#fb7185", "#4ade80"],
      },
    ],
  };

  const monthlyData = {
    labels: monthlyTrends.map((m) => m.month),
    datasets: [
      {
        label: "Ticket Trends",
        data: monthlyTrends.map((m) => m.count),
        borderColor: "#38bdf8",
        fill: false,
      },
    ],
  };

  const statCards = [
    {
      title: "Total Tickets",
      count: totals.totalTickets,
      icon: <FiList size={28} />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Open Tickets",
      count: totals.openTickets,
      icon: <FiAlertCircle size={28} />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Closed Tickets",
      count: totals.closedTickets,
      icon: <FiCheckCircle size={28} />,
      color: "from-yellow-400 to-amber-500",
    },
  ];

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-4">📊 Dashboard Overview</h1>
      <p className="text-gray-300 mb-6">Live insights from your ticketing system</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${card.color} p-5 rounded-2xl shadow-xl flex items-center justify-between`}
          >
            <div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-3xl font-bold mt-2">{card.count}</p>
            </div>
            <div className="opacity-80">{card.icon}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-5 rounded-xl shadow hover:shadow-xl transition duration-300">
          <h2 className="text-md font-semibold mb-2">🎯 Ticket Status</h2>
          <Pie data={statusData} />
        </div>
        <div className="bg-slate-800 p-5 rounded-xl shadow hover:shadow-xl transition duration-300">
          <h2 className="text-md font-semibold mb-2">📌 By Priority</h2>
          <Pie data={priorityData} />
        </div>
        <div className="bg-slate-800 p-5 rounded-xl shadow hover:shadow-xl transition duration-300">
          <h2 className="text-md font-semibold mb-2">📁 By Type</h2>
          <Pie data={typeData} />
        </div>
        <div className="bg-slate-800 p-5 rounded-xl shadow hover:shadow-xl transition duration-300">
          <h2 className="text-md font-semibold mb-2">📈 Monthly Trends</h2>
          <Line data={monthlyData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
