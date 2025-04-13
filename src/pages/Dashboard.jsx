// src/pages/dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ticxnova-logo.png";
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

const pieData = [
  { name: "Open", value: 140 },
  { name: "In Progress", value: 85 },
  { name: "Closed", value: 75 },
];

const barData = [
  { name: "High", count: 50 },
  { name: "Medium", count: 100 },
  { name: "Low", count: 70 },
];

const lineData = [
  { month: "Jan", tickets: 60 },
  { month: "Feb", tickets: 90 },
  { month: "Mar", tickets: 75 },
  { month: "Apr", tickets: 110 },
];

const ticketTypeData = [
  { name: "Incident", value: 120 },
  { name: "Service Request", value: 80 },
  { name: "Change Request", value: 60 },
  { name: "Problem", value: 40 },
];

const recentActivities = [
  { user: "Ram", action: "Created ticket #1042", time: "2 min ago", status: "Open" },
  { user: "Anita", action: "Closed ticket #1039", time: "10 min ago", status: "Closed" },
  { user: "John", action: "Updated priority on ticket #1040", time: "30 min ago", status: "In Progress" },
];

const topUsersData = [
  { name: "Ram", tickets: 34 },
  { name: "Anita", tickets: 29 },
  { name: "John", tickets: 25 },
];

const COLORS = ["#facc15", "#60a5fa", "#34d399", "#f97316"];

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [topUsers, setTopUsers] = useState(topUsersData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  const filteredActivities = recentActivities.filter((item) => {
    const matchesSearch = item.user.toLowerCase().includes(searchQuery.toLowerCase()) || item.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const sortTopUsers = () => {
    const sorted = [...topUsers].sort((a, b) => b.tickets - a.tickets);
    setTopUsers(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-cyan-800 to-indigo-900 text-orange flex">
      {/* Sidebar Navigation */}
      

      {/* Main Dashboard */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-4xl text-white font-bold mb-9">📊 Dashboard Overview</h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search activity or user..."
            className="px-4 py-2 rounded-lg w-full md:w-1/3 bg-white/10 text-white placeholder-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <button
            onClick={sortTopUsers}
            className="bg-gradient-200 hover:bg-cyan-400 text-yellow px-1 py-2 rounded-lg"
          >
            🔁 Sort Top Users
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-500 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-medium mb-2">Total Tickets</h2>
            <p className="text-3xl font-bold">300</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-medium mb-2">Open Tickets</h2>
            <p className="text-3xl font-bold">140</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-amber-400 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-medium mb-2">Closed Tickets</h2>
            <p className="text-3xl font-bold">75</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-white-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">🧮 Ticket Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-blue-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">📌 Tickets by Priority</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" barSize={40} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">📈 Monthly Ticket Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">📂 Tickets by Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={ticketTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {ticketTypeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-1 rounded-lg bg-white/80 text-black"
          >
            <option value="">🎛️ Filter by Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        {/* Recent Activity Feed */}
        <div className="bg-white/10 rounded-lg p-6 shadow-lg text-white">
          <h2 className="text-xl font-semibold mb-4">📅 Recent Activity</h2>
          <ul className="divide-y divide-white/20">
            {filteredActivities.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>👤 {item.user} - {item.action}</span>
                <span className="text-sm text-gray-300">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Users */}
        <div className="mt-8 bg-white/10 rounded-lg p-6 shadow-lg text-white">
          <h2 className="text-xl font-semibold mb-4">🏆 Top Users by Ticket Count</h2>
          <ul className="space-y-2">
            {topUsers.map((user, index) => (
              <li key={index} className="flex justify-between">
                <span>👨‍💼 {user.name}</span>
                <span>{user.tickets} tickets</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
