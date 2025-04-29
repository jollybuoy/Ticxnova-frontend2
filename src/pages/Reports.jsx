import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  FaDownload, FaUserCheck, FaBuilding,
  FaCheckCircle, FaBug, FaChartPie, FaCogs,
} from "react-icons/fa";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f97316", "#ef4444"];

const Reports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [assignedTo, setAssignedTo] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedFields, setSelectedFields] = useState({ sla: true, critical: true, resolution: true });

  const [trends, setTrends] = useState([]);
  const [ticketTypeData, setTicketTypeData] = useState([]);
  const [sla, setSla] = useState(0);
  const [critical, setCritical] = useState(0);
  const [resolution, setResolution] = useState(0);

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/summary`, {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          assignedTo,
          department,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log("📦 Report Data:", data);
      setTrends(data.weeklyTrends);
      setTicketTypeData(data.ticketTypes);
      setSla(data.slaPercentage);
      setCritical(data.criticalIssues);
      setResolution(data.avgResolutionTime);
    } catch (err) {
      console.error("Error loading reports:", err);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate, assignedTo, department]);

  const handleExport = () => {
    alert("📥 Exporting report as PDF/CSV...");
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Ticxnova Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-gray-800">Ticxnova Reports</h1>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          <FaDownload /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-white p-4 rounded-xl shadow">
        <div>
          <label className="text-sm font-semibold">Start Date</label>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full px-3 py-2 rounded text-sm bg-gray-100"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">End Date</label>
          <input
            type="date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="w-full px-3 py-2 rounded text-sm bg-gray-100"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Assigned To</label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm bg-gray-100"
            placeholder="Agent email"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm bg-gray-100"
          >
            <option value="">All</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Facilities">Facilities</option>
          </select>
        </div>
      </div>

      {/* Field Selector */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FaCogs /> Select Report Fields
        </h3>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFields.sla}
              onChange={() => setSelectedFields({ ...selectedFields, sla: !selectedFields.sla })}
            /> SLA Compliance
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFields.critical}
              onChange={() => setSelectedFields({ ...selectedFields, critical: !selectedFields.critical })}
            /> Critical Issues
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFields.resolution}
              onChange={() => setSelectedFields({ ...selectedFields, resolution: !selectedFields.resolution })}
            /> Avg. Resolution Time
          </label>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedFields.sla && (
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
            <FaCheckCircle className="text-4xl" />
            <div>
              <p className="text-sm">Tickets Resolved On-Time</p>
              <p className="text-xl font-bold">{sla}%</p>
            </div>
          </div>
        )}
        {selectedFields.critical && (
          <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
            <FaBug className="text-4xl" />
            <div>
              <p className="text-sm">Critical Issues This Month</p>
              <p className="text-xl font-bold">{critical}</p>
            </div>
          </div>
        )}
        {selectedFields.resolution && (
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
            <FaChartPie className="text-4xl" />
            <div>
              <p className="text-sm">Avg. Resolution Time</p>
              <p className="text-xl font-bold">{resolution} hrs</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
