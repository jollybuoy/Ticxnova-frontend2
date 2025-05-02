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
} from "recharts";

const EnhancedReports = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [filters, setFilters] = useState({});
  const [filterChips, setFilterChips] = useState([]);

  const statusData = [
    { name: "Resolved", value: 55, color: "#4CAF50" },
    { name: "Open", value: 22, color: "#FFC107" },
    { name: "Critical", value: 21, color: "#F44336" },
  ];

  const priorityData = [
    { priority: "P1", tickets: 21, color: "#FF0000" },
    { priority: "P2", tickets: 20, color: "#FFA500" },
    { priority: "P3", tickets: 29, color: "#FFD700" },
    { priority: "P4", tickets: 30, color: "#00FF00" },
  ];

  const dashboardMetrics = [
    { title: "Total Tickets", value: 100, change: "+5%", icon: <FaChartBar className="text-blue-500" /> },
    { title: "Open Tickets", value: 22, change: "-2%", icon: <FaClock className="text-yellow-500" /> },
    { title: "Resolved Tickets", value: 55, change: "+12%", icon: <FaCheckCircle className="text-green-500" /> },
    { title: "Critical Issues", value: 21, change: "+3", icon: <FaExclamationTriangle className="text-red-500" /> },
  ];

  const ticketsData = [
    {
      priority: "P2",
      status: "Closed",
      subject: "Sample Ticket 23",
      assignedTo: "Sarah Williams",
      department: "Finance",
      created: "Apr 29, 2025",
      resolved: "Apr 30, 2025",
    },
    {
      priority: "P1",
      status: "Open",
      subject: "Sample Ticket 12",
      assignedTo: "John Doe",
      department: "IT",
      created: "Apr 28, 2025",
      resolved: "-",
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (!filterChips.some((chip) => chip.field === field)) {
      setFilterChips([...filterChips, { field, value }]);
    }
  };

  const removeFilterChip = (field) => {
    setFilterChips(filterChips.filter((chip) => chip.field !== field));
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  };

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
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg transition hover:scale-105">
            <FaFilter className="inline mr-2" /> Filters
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg transition hover:scale-105">
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
              className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">
                    {metric.title}
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-500">{metric.change}</p>
                </div>
                <div className="text-4xl">{metric.icon}</div>
              </div>
            </div>
          ))}
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
                  <td className="px-4 py-2 border">{ticket.priority}</td>
                  <td className="px-4 py-2 border">{ticket.status}</td>
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
