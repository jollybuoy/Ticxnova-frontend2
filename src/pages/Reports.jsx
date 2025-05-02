import React, { useState } from "react";
import {
  FaFilter,
  FaSyncAlt,
  FaTable,
  FaChartLine,
  FaChartBar,
  FaSave,
  FaUndo,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaDownload,
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

const AdvancedReports = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [filters, setFilters] = useState({
    dateRange: "",
    priority: "",
    department: "",
    status: "",
    type: "",
    assignee: "",
  });

  // Example data for charts and metrics
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

  const ticketTrendsData = [
    { date: "Mar 30", created: 5, resolved: 3 },
    { date: "Apr 4", created: 10, resolved: 6 },
    { date: "Apr 9", created: 7, resolved: 4 },
    { date: "Apr 14", created: 8, resolved: 5 },
    { date: "Apr 19", created: 6, resolved: 4 },
    { date: "Apr 24", created: 9, resolved: 7 },
    { date: "Apr 28", created: 4, resolved: 4 },
  ];

  const dashboardMetrics = [
    { title: "Total Tickets", value: 100, change: "+5%", icon: <FaChartBar className="text-blue-500" /> },
    { title: "Open Tickets", value: 22, change: "-2%", icon: <FaClock className="text-yellow-500" /> },
    { title: "Resolved Tickets", value: 55, change: "+12%", icon: <FaCheckCircle className="text-green-500" /> },
    { title: "Critical Issues", value: 21, change: "+3", icon: <FaExclamationTriangle className="text-red-500" /> },
    { title: "Avg. Resolution Time", value: "1d 5h", change: "", icon: <FaClock className="text-purple-500" /> },
    { title: "Created Today", value: 3, change: "-3", icon: <FaClock className="text-blue-500" /> },
    { title: "Top Department", value: "Marketing", subtext: "16 tickets", icon: <FaChartBar className="text-orange-500" /> },
    { title: "Top Assignee", value: "Sarah Williams", subtext: "23 tickets", icon: <FaChartLine className="text-teal-500" /> },
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
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Showing 100 of 100 tickets</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-200 hover:bg-blue-100 rounded shadow transition">
            <FaFilter className="inline mr-2 text-blue-500" /> Filters
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded shadow transition">
            <FaDownload className="inline mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded shadow transition ${
            activeTab === "Table" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("Table")}
        >
          <FaTable className="inline mr-2" /> Table
        </button>
        <button
          className={`px-4 py-2 rounded shadow transition ${
            activeTab === "Dashboard" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("Dashboard")}
        >
          <FaChartLine className="inline mr-2" /> Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded shadow transition ${
            activeTab === "Charts" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("Charts")}
        >
          <FaChartBar className="inline mr-2" /> Charts
        </button>
      </div>

      {/* Conditional Sections */}
      {activeTab === "Dashboard" && (
        <>
          {/* Filter Tickets */}
          <div className="p-4 bg-white shadow rounded mb-6">
            <h3 className="text-lg font-bold mb-4">
              <FaFilter className="inline mr-2 text-blue-500" /> Filter Tickets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Date Range"
                className="border rounded p-2 w-full"
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              />
              <select
                className="border rounded p-2 w-full"
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="">Priority</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
              <select
                className="border rounded p-2 w-full"
                onChange={(e) => handleFilterChange("department", e.target.value)}
              >
                <option value="">Department</option>
                <option value="Marketing">Marketing</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
              <input
                type="text"
                placeholder="Search Tickets"
                className="border rounded p-2 w-full"
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {dashboardMetrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow rounded flex items-center justify-between hover:shadow-lg transition"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-700">{metric.title}</h4>
                  <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                  {metric.subtext && <p className="text-sm text-gray-500">{metric.subtext}</p>}
                </div>
                <div className="text-3xl">{metric.icon}</div>
              </div>
            ))}
          </div>
        </>
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

      {activeTab === "Charts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tickets by Priority */}
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold mb-4">Tickets by Priority</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData}>
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tickets">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ticket Trends */}
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold mb-4">Ticket Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ticketTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#8884d8" />
                <Line type="monotone" dataKey="resolved" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReports;
