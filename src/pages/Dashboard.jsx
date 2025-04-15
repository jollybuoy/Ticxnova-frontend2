import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "../api/axios";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/tickets/dashboard/summary")
      .then(res => setSummary(res.data))
      .catch(() => setError("Failed to load summary."));

    axios.get("/api/tickets/sla-stats")
      .then(res => setSlaStats(res.data))
      .catch(() => setError("Failed to load SLA stats."));

    axios.get("/api/tickets/activity-log")
      .then(res => setActivity(res.data))
      .catch(() => setError("Failed to load activity log."));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-semibold">Total Tickets</h2>
            <p className="text-2xl mt-2">{summary.total}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-semibold text-blue-600">Open</h2>
            <p className="text-2xl mt-2">{summary.open}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-semibold text-green-600">Closed</h2>
            <p className="text-2xl mt-2">{summary.closed}</p>
          </div>
        </div>
      )}

      {slaStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-sm font-medium">Avg. Resolution Time (days)</h2>
            <p className="text-xl font-bold mt-1">{slaStats.avgResolutionTime}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-sm font-medium">SLA Violations</h2>
            <p className="text-xl font-bold mt-1 text-red-600">{slaStats.slaViolations}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-sm font-medium">Longest Open Ticket (days)</h2>
            <p className="text-xl font-bold mt-1">{slaStats.longestOpenTicketDays}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-sm font-medium">SLA Compliance (%)</h2>
            <p className="text-xl font-bold mt-1 text-green-600">{slaStats.slaCompliancePercent}%</p>
          </div>
        </div>
      )}

      {summary?.monthly && (
        <div className="bg-white p-6 shadow rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="open" fill="#3b82f6" />
              <Bar dataKey="closed" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activity.length > 0 && (
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {activity.map((log, index) => (
              <li key={index} className="text-sm text-gray-700">
                <strong>{log.user}</strong> {log.action} ticket #{log.ticketId} on {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
