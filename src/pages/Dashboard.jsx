// Enhanced dashboard with advanced visuals, animations, filters, KPIs, and recent activity
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
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

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
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([
    "User1 updated ticket #101 - Status: In Progress",
    "User2 created ticket #102 - Priority: High",
    "User3 closed ticket #100 - Resolved",
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/tickets/dashboard/summary");
        setData(response.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading Dashboard...</div>;
  if (!data) return <div className="text-center mt-10 text-red-500">Failed to load data.</div>;

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
      trend: 5,
      icon: <FiList size={28} />, 
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Open Tickets",
      count: totals.openTickets,
      trend: 8,
      icon: <FiAlertCircle size={28} />, 
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Closed Tickets",
      count: totals.closedTickets,
      trend: -2,
      icon: <FiCheckCircle size={28} />, 
      color: "from-yellow-400 to-amber-500",
    },
  ];

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">📊 Dashboard Overview</h1>
      <p className="text-gray-300 mb-6">Live ticket stats, trends, and insights</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${card.color} p-5 rounded-2xl shadow-xl flex justify-between items-center`}
          >
            <div>
              <h2 className="text-md font-semibold">{card.title}</h2>
              <motion.p
                className="text-3xl font-bold mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {card.count}
              </motion.p>
              <div className="text-sm mt-1 flex items-center gap-1">
                {card.trend >= 0 ? (
                  <span className="text-green-200 flex items-center">
                    <AiOutlineArrowUp /> {card.trend}% this month
                  </span>
                ) : (
                  <span className="text-red-300 flex items-center">
                    <AiOutlineArrowDown /> {Math.abs(card.trend)}% down
                  </span>
                )}
              </div>
            </div>
            <div className="opacity-90">{card.icon}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-2">🎯 Ticket Status</h2>
          <Pie data={statusData} />
        </div>
        <div className="bg-slate-800 p-5 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-2">📌 By Priority</h2>
          <Pie data={priorityData} />
        </div>
        <div className="bg-slate-800 p-5 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-2">📁 By Type</h2>
          <Pie data={typeData} />
        </div>
        <div className="bg-slate-800 p-5 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-2">📈 Monthly Trends</h2>
          <Line data={monthlyData} />
        </div>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-3">🕒 Recent Ticket Activity</h2>
        <ul className="list-disc list-inside text-sm text-gray-300">
          {activity.map((event, i) => (
            <li key={i} className="mb-1">{event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
