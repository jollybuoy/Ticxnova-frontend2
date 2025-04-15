import React, { useEffect, useState } from "react";
import API from "../api/axios"; // ✅ Correct path to axios instance

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [error, setError] = useState(null);
  const [slaError, setSlaError] = useState(null);

  useEffect(() => {
    // Load Ticket Summary
    API.get("/api/tickets/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error("❌ Dashboard fetch failed:", err);
        setError("Failed to load ticket summary.");
      });

    // Load SLA Stats
    API.get("/api/tickets/sla-stats")
      .then((res) => setSlaStats(res.data))
      .catch((err) => {
        console.error("❌ SLA stats fetch failed:", err);
        setSlaError("Failed to load SLA stats.");
      });
  }, []);

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-black">Dashboard</h1>

      {/* Ticket Summary */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white text-black p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Total Tickets</h2>
            <p className="text-3xl mt-2 font-bold">{summary.total ?? 0}</p>
          </div>
          <div className="bg-white text-blue-700 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Open</h2>
            <p className="text-3xl mt-2 font-bold">{summary.open ?? 0}</p>
          </div>
          <div className="bg-white text-green-700 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Closed</h2>
            <p className="text-3xl mt-2 font-bold">{summary.closed ?? 0}</p>
          </div>
        </div>
      )}

      {/* SLA Stats */}
      {slaError && <p className="text-red-500">{slaError}</p>}
      {slaStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white text-purple-800 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Avg Resolution Time</h2>
            <p className="text-3xl mt-2 font-bold">{slaStats.avgResolutionTime ?? 0} hrs</p>
          </div>
          <div className="bg-white text-red-700 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">SLA Violations</h2>
            <p className="text-3xl mt-2 font-bold">{slaStats.slaViolations ?? 0}</p>
          </div>
          <div className="bg-white text-orange-700 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Longest Open Ticket</h2>
            <p className="text-3xl mt-2 font-bold">{slaStats.longestOpenTicketDays ?? 0} days</p>
          </div>
          <div className="bg-white text-green-800 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">SLA Compliance</h2>
            <p className="text-3xl mt-2 font-bold">{slaStats.slaCompliancePercent ?? 0}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
