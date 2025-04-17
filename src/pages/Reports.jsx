// src/pages/Reports.jsx (Advanced Reports System)
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FaFilter,
  FaCalendarAlt,
  FaUserCheck,
  FaBuilding,
  FaDownload,
  FaSearch,
  FaTicketAlt,
  FaCheckCircle,
  FaBug,
  FaChartPie,
} from "react-icons/fa";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f97316", "#ef4444"];

const Reports = () => {
  const [dateRange, setDateRange] = useState("last7");
  const [assignedTo, setAssignedTo] = useState("");
  const [department, setDepartment] = useState("");
  const [filtered, setFiltered] = useState(false);

  // Dummy report data
  const trends = [
    { name: "Mon", Open: 12, Closed: 9 },
    { name: "Tue", Open: 15, Closed: 11 },
    { name: "Wed", Open: 20, Closed: 17 },
    { name: "Thu", Open: 9, Closed: 13 },
    { name: "Fri", Open: 7, Closed: 14 },
    { name: "Sat", Open: 6, Closed: 10 },
    { name: "Sun", Open: 3, Closed: 9 },
  ];

  const ticketTypeData = [
    { name: "Incident", value: 30 },
    { name: "Service", value: 15 },
    { name: "Change", value: 10 },
    { name: "Problem", value: 5 },
  ];

  const handleExport = () => {
    alert("📦 Exporting filtered report as PDF...");
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📈 Detailed Reports</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow hover:brightness-110"
        >
          <FaDownload /> Export PDF
        </button>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-gray-100 px-3 py-2 rounded text-sm"
          >
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <FaUserCheck className="text-green-600" />
          <input
            type="text"
            placeholder="Assigned To (Name)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full bg-gray-100 px-3 py-2 rounded text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaBuilding className="text-indigo-500" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-gray-100 px-3 py-2 rounded text-sm"
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Facilities">Facilities</option>
          </select>
        </div>
        <button
          onClick={() => setFiltered(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <FaSearch /> Apply Filters
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">📆 Weekly Ticket Flow</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Open" fill="#3b82f6" />
              <Bar dataKey="Closed" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Ticket Types */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">🧾 Ticket Type Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ticketTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {ticketTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <FaCheckCircle className="text-4xl" />
          <div>
            <p className="text-sm">Tickets Resolved On-Time</p>
            <p className="text-xl font-bold">86%</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <FaBug className="text-4xl" />
          <div>
            <p className="text-sm">Critical Issues This Month</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <FaChartPie className="text-4xl" />
          <div>
            <p className="text-sm">Avg. Resolution Time</p>
            <p className="text-xl font-bold">3.4 hrs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
