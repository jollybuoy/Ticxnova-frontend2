import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // uses your working axios instance
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ticket summary
    axios.get("/api/tickets/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setErrors(prev => ({ ...prev, summary: "Failed to load summary." })));

    // SLA stats
    axios.get("/api/tickets/sla-stats")
      .then((res) => setSlaStats(res.data))
      .catch(() => setErrors(prev => ({ ...prev, sla: "Failed to load SLA stats." })));

    // Activity log
    axios.get("/api/tickets/activity-log")
      .then((res) => setActivityLog(res.data))
      .catch(() => setErrors(prev => ({ ...prev, activity: "Failed to load activity log." })));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {/* Ticket Summary */}
      {errors.summary && <p className="text-red-500">{errors.summary}</p>}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white text-black p-4 rounded-xl shadow-lg">
            <h2 className="font-semibold">Total Tickets</h2>
            <p className="text-2xl">{summary.total}</p>
          </div>
          <div className="bg-white text-blue-600 p-4 rounded-xl shadow-lg">
            <h2 className="font-semibold">Open</h2>
            <p className="text-2xl">{summary.open}</p>
          </div>
          <div className="bg-white text-green-600 p-4 rounded-xl shadow-lg">
            <h2 className="font-semibold">Closed</h2>
            <p className="text-2xl">{summary.closed}</p>
          </div>
        </div>
      )}

      {/* SLA Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-2">SLA Statistics</h2>
      {errors.sla && <p className="text-red-500">{errors.sla}</p>}
      {slaStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white text-black p-4 rounded-xl shadow">
            <h3>Avg. Resolution Time</h3>
            <p className="text-xl">{slaStats.avgResolutionTime} days</p>
          </div>
          <div className="bg-white text-red-600 p-4 rounded-xl shadow">
            <h3>SLA Violations</h3>
            <p className="text-xl">{slaStats.slaViolations}</p>
          </div>
          <div className="bg-white text-yellow-600 p-4 rounded-xl shadow">
            <h3>Longest Open Ticket</h3>
            <p className="text-xl">{slaStats.longestOpenTicketDays} days</p>
          </div>
          <div className="bg-white text-green-600 p-4 rounded-xl shadow">
            <h3>Compliance</h3>
            <p className="text-xl">{slaStats.slaCompliancePercent}%</p>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <h2 className="text-2xl font-semibold mt-8 mb-2">Recent Ticket Activity</h2>
      {errors.activity && <p className="text-red-500">{errors.activity}</p>}
      {activityLog.length > 0 && (
        <div className="bg-white text-black p-4 rounded-xl shadow max-h-96 overflow-y-auto">
          <ul className="divide-y">
            {activityLog.map((log, index) => (
              <li key={index} className="py-2">
                <p><strong>{log.user}</strong> <span className="text-purple-600">{log.action}</span> ticket <strong>#{log.ticketId}</strong></p>
                <p className="text-sm text-gray-500">Status: {log.status || log.priority} • {new Date(log.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Graph (Optional) */}
      {summary && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-2">Ticket Distribution</h2>
          <div className="bg-white p-4 rounded-xl shadow max-w-2xl">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Open', value: summary.open },
                { name: 'Closed', value: summary.closed }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
