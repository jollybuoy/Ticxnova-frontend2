import React, { useState } from "react";
import {
  FaFilter,
  FaDownload,
  FaTable,
  FaChartLine,
  FaChartBar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const EnhancedReports = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const dashboardMetrics = [
    {
      title: "Total Tickets",
      value: 100,
      change: "+5%",
      color: "from-indigo-500 to-purple-600",
      icon: <FaChartBar className="text-blue-500" />,
    },
    {
      title: "Open Tickets",
      value: 22,
      change: "-2%",
      color: "from-orange-400 to-yellow-200",
      icon: <FaClock className="text-yellow-500" />,
    },
    {
      title: "Resolved Tickets",
      value: 55,
      change: "+12%",
      color: "from-green-500 to-lime-500",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      title: "Critical Issues",
      value: 21,
      change: "+3",
      color: "from-red-500 to-pink-500",
      icon: <FaExclamationTriangle className="text-red-500" />,
    },
    {
      title: "Top Department",
      value: "Marketing",
      subtext: "16 tickets",
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Top Agent",
      value: "Sarah Williams",
      subtext: "23 tickets",
      color: "from-teal-500 to-blue-500",
    },
    {
      title: "SLA Compliance",
      value: "95%",
      change: "+5%",
      color: "from-green-400 to-green-600",
    },
  ];

  const ticketsData = [
    {
      priority: "P1",
      status: "Open",
      subject: "Critical system failure",
      assignedTo: "John Doe",
      department: "IT",
      created: "May 1, 2025",
      resolved: "-",
      priorityColor: "text-red-500",
      statusColor: "text-yellow-500",
    },
    {
      priority: "P2",
      status: "Closed",
      subject: "Network issue",
      assignedTo: "Jane Smith",
      department: "Networking",
      created: "Apr 30, 2025",
      resolved: "May 1, 2025",
      priorityColor: "text-orange-500",
      statusColor: "text-green-500",
    },
    {
      priority: "P3",
      status: "Open",
      subject: "Login issue",
      assignedTo: "Alice Johnson",
      department: "Support",
      created: "Apr 28, 2025",
      resolved: "-",
      priorityColor: "text-yellow-500",
      statusColor: "text-yellow-500",
    },
  ];

  const statusData = [
    { status: "Open", count: 22 },
    { status: "Resolved", count: 55 },
    { status: "Critical", count: 21 },
  ];

  const priorityData = [
    { priority: "P1", count: 21 },
    { priority: "P2", count: 20 },
    { priority: "P3", count: 30 },
  ];

  const trendsData = [
    { month: "Jan", count: 20 },
    { month: "Feb", count: 30 },
    { month: "Mar", count: 25 },
    { month: "Apr", count: 40 },
    { month: "May", count: 35 },
  ];

  const slaData = [
    { name: "Compliant", value: 95 },
    { name: "Violation", value: 5 },
  ];

  const COLORS = ["#34d399", "#fbbf24", "#60a5fa", "#f87171", "#a78bfa", "#f472b6"];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500">Showing 100 of 100 tickets</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg transition transform hover:scale-105">
            <FaFilter className="inline mr-2" /> Filters
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg transition transform hover:scale-105">
            <FaDownload className="inline mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "Table"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("Table")}
        >
          <FaTable className="inline mr-2" /> Table
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "Dashboard"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("Dashboard")}
        >
          <FaChartLine className="inline mr-2" /> Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "Charts"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("Charts")}
        >
          <FaChartBar className="inline mr-2" /> Charts
        </button>
      </div>

      {/* Dynamic Content */}
      {activeTab === "Dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardMetrics.map((metric, index) => (
            <div
              key={index}
              className={`p-6 bg-gradient-to-r ${metric.color} rounded-lg shadow-lg hover:shadow-xl transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-100">
                    {metric.title}
                  </h4>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  {metric.subtext && (
                    <p className="text-sm text-gray-200">{metric.subtext}</p>
                  )}
                </div>
                <div className="text-4xl">{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={slaData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#68a1ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "Table" && (
        <div className="bg-white shadow rounded p-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Priority</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Assigned To</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {ticketsData.map((ticket, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className={`px-4 py-2 border ${ticket.priorityColor}`}>
                    {ticket.priority}
                  </td>
                  <td className={`px-4 py-2 border ${ticket.statusColor}`}>
                    {ticket.status}
                  </td>
                  <td className="px-4 py-2 border">{ticket.subject}</td>
                  <td className="px-4 py-2 border">{ticket.assignedTo}</td>
                  <td className="px-4 py-2 border">{ticket.department}</td>
                  <td className="px-4 py-2 border">{ticket.created}</td>
                  <td className="px-4 py-2 border">{ticket.resolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnhancedReports;
