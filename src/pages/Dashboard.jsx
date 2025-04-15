// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [error, setError] = useState({ summary: false, sla: false, activity: false });

  useEffect(() => {
    API.get("/tickets/dashboard/summary")
      .then(res => setSummary(res.data))
      .catch(() => setError(prev => ({ ...prev, summary: true })));

    API.get("/tickets/sla-stats")
      .then(res => setSlaStats(res.data))
      .catch(() => setError(prev => ({ ...prev, sla: true })));

    API.get("/tickets/activity-log")
      .then(res => setActivityLog(res.data))
      .catch(() => setError(prev => ({ ...prev, activity: true })));
  }, []);

  const summaryData = [
    { name: "Total", value: summary?.total || 0 },
    { name: "Open", value: summary?.open || 0 },
    { name: "Closed", value: summary?.closed || 0 }
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Dashboard</h1>

      {error.summary ? (
        <p className="text-red-400 mb-4">Failed to load summary.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold">Total Tickets</h2>
              <p className="text-3xl font-bold mt-2">{summary?.total ?? 0}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold">Open</h2>
              <p className="text-3xl font-bold mt-2">{summary?.open ?? 0}</p>
            </div>
            <div className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold">Closed</h2>
              <p className="text-3xl font-bold mt-2">{summary?.closed ?? 0}</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md mb-10">
            <h2 className="text-xl font-semibold mb-4">Ticket Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={summaryData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip wrapperStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">SLA Statistics</h2>
      {error.sla ? (
        <p className="text-red-400">Failed to load SLA stats.</p>
      ) : slaStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
          <div className="bg-gray-800 rounded-xl p-5 shadow-md">Avg Resolution Time: {slaStats.avgResolutionTime} hrs</div>
          <div className="bg-gray-800 rounded-xl p-5 shadow-md">SLA Violations: {slaStats.slaViolations}</div>
          <div className="bg-gray-800 rounded-xl p-5 shadow-md">Longest Open Ticket: {slaStats.longestOpenTicketDays} days</div>
          <div className="bg-gray-800 rounded-xl p-5 shadow-md">Compliance: {slaStats.slaCompliancePercent}%</div>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-10 mb-4">Recent Ticket Activity</h2>
      {error.activity ? (
        <p className="text-red-400">Failed to load activity log.</p>
      ) : (
        <div className="space-y-4">
          {activityLog.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 shadow">
              <div><strong>{item.user}</strong> {item.action} ticket <strong>#{item.ticketId}</strong></div>
              <div>Status: {item.status || item.priority}</div>
              <div className="text-sm text-gray-400 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
