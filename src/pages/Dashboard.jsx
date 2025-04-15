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
    API.get("/api/tickets/dashboard/summary")
      .then(res => setSummary(res.data))
      .catch(() => setError(prev => ({ ...prev, summary: true })));

    API.get("/api/tickets/sla-stats")
      .then(res => setSlaStats(res.data))
      .catch(() => setError(prev => ({ ...prev, sla: true })));

    API.get("/api/tickets/activity-log")
      .then(res => setActivityLog(res.data))
      .catch(() => setError(prev => ({ ...prev, activity: true })));
  }, []);

  const summaryData = [
    { name: "Total", value: summary?.total || 0 },
    { name: "Open", value: summary?.open || 0 },
    { name: "Closed", value: summary?.closed || 0 }
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error.summary ? (
        <p className="text-red-500 mb-4">Failed to load summary.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white text-black rounded-xl p-4 shadow">
              <h2 className="font-semibold text-xl">Total Tickets</h2>
              <p className="text-2xl mt-2">{summary?.total ?? 0}</p>
            </div>
            <div className="bg-white text-blue-600 rounded-xl p-4 shadow">
              <h2 className="font-semibold text-xl">Open</h2>
              <p className="text-2xl mt-2">{summary?.open ?? 0}</p>
            </div>
            <div className="bg-white text-green-600 rounded-xl p-4 shadow">
              <h2 className="font-semibold text-xl">Closed</h2>
              <p className="text-2xl mt-2">{summary?.closed ?? 0}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold text-black mb-2">Ticket Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summaryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">SLA Statistics</h2>
      {error.sla ? (
        <p className="text-red-500">Failed to load SLA stats.</p>
      ) : slaStats && (
        <div className="grid grid-cols-2 gap-6 text-black">
          <div className="bg-white rounded-xl p-4 shadow">Avg Resolution Time: {slaStats.avgResolutionTime} hrs</div>
          <div className="bg-white rounded-xl p-4 shadow">SLA Violations: {slaStats.slaViolations}</div>
          <div className="bg-white rounded-xl p-4 shadow">Longest Open Ticket: {slaStats.longestOpenTicketDays} days</div>
          <div className="bg-white rounded-xl p-4 shadow">Compliance: {slaStats.slaCompliancePercent}%</div>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Ticket Activity</h2>
      {error.activity ? (
        <p className="text-red-500">Failed to load activity log.</p>
      ) : (
        <div className="space-y-3 text-sm">
          {activityLog.map((item, index) => (
            <div key={index} className="bg-white text-black rounded p-3 shadow">
              <div><strong>{item.user}</strong> {item.action} ticket <strong>#{item.ticketId}</strong></div>
              <div>Status: {item.status || item.priority}</div>
              <div className="text-xs text-gray-600">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
