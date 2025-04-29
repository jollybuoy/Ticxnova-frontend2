import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f97316", "#ef4444", "#9333ea"];

const Reports = () => {
  const [reportData, setReportData] = useState({
    byStatus: [],
    byPriority: [],
    byType: [],
    byDepartment: [],
    monthly: []
  });

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/simple`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(response.data);
    } catch (err) {
      console.error("❌ Failed to fetch simple report:", err);
    }
  };

  const exportChartData = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-white">
      <div className="flex items-center gap-3 mb-6">
        <img src="/ticxnova-logo.png" alt="Ticxnova Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">📊 Ticxnova Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">📌 Tickets by Status</h2>
            <button onClick={() => exportChartData(reportData.byStatus, "Tickets_By_Status")} className="text-blue-600 text-sm underline">Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={reportData.byStatus.filter(d => d.status)} dataKey="count" nameKey="status" outerRadius={80} label>
                {reportData.byStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">🔥 Tickets by Priority</h2>
            <button onClick={() => exportChartData(reportData.byPriority, "Tickets_By_Priority")} className="text-blue-600 text-sm underline">Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={reportData.byPriority.filter(d => d.priority)} dataKey="count" nameKey="priority" outerRadius={80} label>
                {reportData.byPriority.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Type Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">📂 Tickets by Type</h2>
            <button onClick={() => exportChartData(reportData.byType, "Tickets_By_Type")} className="text-blue-600 text-sm underline">Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={reportData.byType.filter(d => d.ticketType)} dataKey="count" nameKey="ticketType" outerRadius={80} label>
                {reportData.byType.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow col-span-1 xl:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">🏢 Tickets by Department</h2>
            <button onClick={() => exportChartData(reportData.byDepartment, "Tickets_By_Department")} className="text-blue-600 text-sm underline">Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportData.byDepartment.filter(d => d.department)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white p-4 rounded-xl shadow col-span-1 xl:col-span-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">📅 Monthly Ticket Trend</h2>
            <button onClick={() => exportChartData(reportData.monthly, "Monthly_Tickets")} className="text-blue-600 text-sm underline">Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportData.monthly.filter(d => d.month)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
