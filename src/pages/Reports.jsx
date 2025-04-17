// src/pages/Reports.jsx (Advanced Visual Reports Page)
import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { FaTicketAlt, FaClock, FaChartLine, FaUserShield, FaDownload } from "react-icons/fa";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f97316", "#ef4444"];

const Reports = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  // Dummy data (replace with backend data later)
  const ticketStats = {
    total: 125,
    open: 34,
    closed: 71,
    inProgress: 20,
    slaCompliance: 92.3,
  };

  const monthlyTrends = [
    { month: "Jan", tickets: 20 },
    { month: "Feb", tickets: 35 },
    { month: "Mar", tickets: 40 },
    { month: "Apr", tickets: 30 },
    { month: "May", tickets: 25 },
    { month: "Jun", tickets: 50 },
  ];

  const departmentData = [
    { name: "IT", value: 45 },
    { name: "HR", value: 25 },
    { name: "Finance", value: 20 },
    { name: "Facilities", value: 10 },
  ];

  useEffect(() => {
    setTimeout(() => setDataLoaded(true), 500); // simulate loading
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Reports Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
          <FaTicketAlt className="text-blue-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Total Tickets</p>
            <p className="text-xl font-bold text-gray-800">{ticketStats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
          <FaClock className="text-purple-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">SLA Compliance</p>
            <p className="text-xl font-bold text-gray-800">{ticketStats.slaCompliance}%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
          <FaChartLine className="text-green-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Open Tickets</p>
            <p className="text-xl font-bold text-gray-800">{ticketStats.open}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
          <FaUserShield className="text-orange-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Closed Tickets</p>
            <p className="text-xl font-bold text-gray-800">{ticketStats.closed}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend Line Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">📈 Monthly Ticket Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart by Department */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">🏢 Tickets by Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Section */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm shadow-md">
          <FaDownload /> Export PDF
        </button>
      </div>
    </div>
  );
};

export default Reports;
