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

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

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
    { title: "Total Tickets", value: 100, change: "+5%", icon: <FaChartBar /> },
    { title: "Open Tickets", value: 22, change: "-2%", icon: <FaClock /> },
    { title: "Resolved Tickets", value: 55, change: "+12%", icon: <FaCheckCircle /> },
    { title: "Critical Issues", value: 21, change: "+3", icon: <FaExclamationTriangle /> },
    { title: "Avg. Resolution Time", value: "1d 5h", change: "", icon: <FaClock /> },
    { title: "Created Today", value: 3, change: "-3", icon: <FaClock /> },
    { title: "Top Department", value: "Marketing", subtext: "16 tickets", icon: <FaChartBar /> },
    { title: "Top Assignee", value: "Sarah Williams", subtext: "23 tickets", icon: <FaChartLine /> },
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Showing 100 of 100 tickets</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-200 rounded">
            <FaFilter className="inline mr-2" /> Filters
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            <FaDownload className="inline mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "Table" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Table")}
        >
          <FaTable className="inline mr-2" /> Table
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "Dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Dashboard")}
        >
          <FaChartLine className="inline mr-2" /> Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "Charts" ? "bg-blue-500 text-white" : "bg-gray-200"
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
                className="border rounded p-2"
              />
              <select className="border rounded p-2">
                <option>Priority</option>
                <option>P1</option>
                <option>P2</option>
                <option>P3</option>
                <option>P4</option>
              </select>
              <select className="border rounded p-2">
                <option>Department</option>
                <option>Marketing</option>
                <option>IT</option>
                <option>HR</option>
                <option>Sales</option>
              </select>
              <input
                type="text"
                placeholder="Search Tickets"
                className="border rounded p-2"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                <FaSave className="inline mr-2" /> Save Filters
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded">
                <FaUndo className="inline mr-2" /> Reset
              </button>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {dashboardMetrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow rounded flex items-center justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold">{metric.title}</h4>
                  <p className="text-xl font-bold">{metric.value}</p>
                  {metric.subtext && <p className="text-sm text-gray-500">{metric.subtext}</p>}
                </div>
                <div className="text-3xl text-gray-400">{metric.icon}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "Table" && (
        <div className="bg-white shadow rounded p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Assigned To</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {ticketsData.map((ticket, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{ticket.priority}</td>
                  <td className="px-4 py-2">{ticket.status}</td>
                  <td className="px-4 py-2">{ticket.subject}</td>
                  <td className="px-4 py-2">{ticket.assignedTo}</td>
                  <td className="px-4 py-2">{ticket.department}</td>
                  <td className="px-4 py-2">{ticket.created}</td>
                  <td className="px-4 py-2">{ticket.resolved}</td>
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

export default Reports;
