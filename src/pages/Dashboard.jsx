// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

const COLORS = ["#facc15", "#60a5fa", "#34d399", "#f97316"];

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total: 0,
    open: 0,
    closed: 0,
    statusCounts: [],
    priorityCounts: [],
    typeCounts: [],
    monthlyTrends: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://ticxnova-a6e8f0cmaxguhpfm.canadacentral-01.azurewebsites.net/api/tickets/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSummary(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard summary:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-cyan-800 to-indigo-900 text-orange flex">
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-4xl text-white font-bold mb-9">📊 Dashboard Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-500 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-medium mb-2">Total Tickets</h2>
            <p className="text-3xl font-bold">{summary.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-medium mb-2">Open Tickets</h2>
            <p className="text-3xl font-bold">{summary.open}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-amber-400 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-medium mb-2">Closed Tickets</h2>
            <p className="text-3xl font-bold">{summary.closed}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-8">
          {/* Ticket Status Breakdown */}
          <div className="bg-gradient-to-br from-green-500 to-white-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">🧮 Ticket Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={summary.statusCounts}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label
                >
                  {summary.statusCounts.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority */}
          <div className="bg-gradient-to-br from-yellow-400 to-blue-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">📌 Tickets by Priority</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={summary.priorityCounts}>
                <XAxis dataKey="priority" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" barSize={40} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends */}
          <div className="bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">📈 Monthly Ticket Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={summary.monthlyTrends}>
                <XAxis dataKey="month" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Ticket Type */}
          <div className="bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">📂 Tickets by Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={summary.typeCounts}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label
                >
                  {summary.typeCounts.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
