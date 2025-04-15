// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend, CartesianGrid
} from "recharts";

const COLORS = ["#38bdf8", "#4ade80", "#facc15", "#f87171", "#a78bfa", "#fb923c"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    API.get("/tickets/dashboard/summary").then(res => setSummary(res.data));
    API.get("/tickets/sla-stats").then(res => setSlaStats(res.data));
    API.get("/tickets/activity-log").then(res => setActivityLog(res.data));
    API.get("/tickets/dashboard/types").then(res => setTypesData(res.data));
    API.get("/tickets/dashboard/status").then(res => setStatusData(res.data));
    API.get("/tickets/dashboard/priorities").then(res => setPriorityData(res.data));
    API.get("/tickets/dashboard/monthly-trends").then(res => setMonthlyData(res.data));
  }, []);

  return (
    <div className="p-6 text-white bg-gradient-to-tr from-[#0f172a] to-[#1e293b] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-cyan-400">🎯 Ticketing Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white text-black rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold text-xl">📊 Total Tickets</h2>
          <p className="text-3xl font-bold mt-3">{summary?.total ?? 0}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold text-xl">🟢 Open</h2>
          <p className="text-3xl font-bold mt-3">{summary?.open ?? 0}</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold text-xl">✅ Closed</h2>
          <p className="text-3xl font-bold mt-3">{summary?.closed ?? 0}</p>
        </div>
      </div>

      {/* Ticket Type Pie Chart */}
      <div className="bg-white p-6 rounded-2xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold text-black mb-4">📂 Ticket Types</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={typesData} dataKey="count" nameKey="type" outerRadius={100}>
              {typesData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Ticket Status Bar Chart */}
      <div className="bg-white p-6 rounded-2xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold text-black mb-4">📶 Ticket Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ticket Priority Donut */}
      <div className="bg-white p-6 rounded-2xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold text-black mb-4">⚠️ Ticket Priority</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={priorityData} dataKey="count" nameKey="priority" innerRadius={70} outerRadius={100}>
              {priorityData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trends Line Chart */}
      <div className="bg-white p-6 rounded-2xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold text-black mb-4">📅 Monthly Ticket Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SLA Donut */}
      {slaStats && (
        <div className="bg-white p-6 rounded-2xl mb-10 shadow-xl">
          <h2 className="text-xl font-bold text-black mb-4">✅ SLA Compliance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={[{ name: "Compliant", value: slaStats.slaCompliancePercent }, { name: "Violation", value: 100 - slaStats.slaCompliancePercent }]} innerRadius={80} outerRadius={100} dataKey="value">
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
