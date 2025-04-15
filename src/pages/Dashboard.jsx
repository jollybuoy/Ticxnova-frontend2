import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance"; // make sure this sets baseURL + token
import { FaTicketAlt, FaSpinner, FaCheckCircle, FaBug } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: { total: 0, open: 0, closed: 0 },
    priorities: [],
    types: [],
    monthlyTrends: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/tickets/dashboard/summary");
        setStats(res.data);
      } catch (err) {
        console.error("❌ Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">📊 Ticket Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={<FaTicketAlt />} title="Total" value={stats.totalTickets.total} />
        <Card icon={<FaSpinner />} title="Open" value={stats.totalTickets.open} />
        <Card icon={<FaCheckCircle />} title="Closed" value={stats.totalTickets.closed} />
      </div>

      {/* Priorities */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">By Priority</h3>
        <ul className="list-disc ml-5 mt-2">
          {stats.priorities.map((item, idx) => (
            <li key={idx}>{item.priority}: {item.count}</li>
          ))}
        </ul>
      </div>

      {/* Types */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">By Type</h3>
        <ul className="list-disc ml-5 mt-2">
          {stats.types.map((item, idx) => (
            <li key={idx}>{item.type || 'Uncategorized'}: {item.count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="bg-white rounded shadow p-4 flex items-center space-x-4">
    <div className="text-xl text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
