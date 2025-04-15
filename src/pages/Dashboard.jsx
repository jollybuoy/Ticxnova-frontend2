// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // Make sure axios instance is configured
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#facc15", "#60a5fa", "#34d399", "#f97316"];

const Dashboard = ({ setAuth }) => {
  const [summary, setSummary] = useState(null);

  const fetchDashboardSummary = async () => {
    try {
      const res = await axios.get("/tickets/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard summary:", err);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  if (!summary) {
    return <div className="text-white p-6">Loading dashboard data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-cyan-800 to-indigo-900 text-orange p-6">
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
        {/* Ticket Status Pie */}
        <div className="bg-white/10 p-5 rounded-lg shadow text-white">
          <h2 className="text-xl font-semibold mb-4">🎯 Ticket Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Open", value: summary.open },
                  { name: "Closed", value: summary.closed },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Priority Bar */}
        <div className="bg-white/10 p-5 rounded-lg shadow text-white">
          <h2 className="text-xl font-semibold mb-4">📌 Tickets by Priority</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.priority}>
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Bar dataKey="count" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Type Pie */}
        <div className="bg-white/10 p-5 rounded-lg shadow text-white">
          <h2 className="text-xl font-semibold mb-4">📂 Tickets by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summary.types}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {summary.types.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends Line */}
        <div className="bg-white/10 p-5 rounded-lg shadow text-white">
          <h2 className="text-xl font-semibold mb-4">📈 Monthly Ticket Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={summary.monthlyTrends}>
              <XAxis dataKey="month" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#60a5fa"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
