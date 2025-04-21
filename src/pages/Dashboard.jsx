// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer,
  Legend
} from "recharts";

const Dashboard = () => {
  const [filterBy, setFilterBy] = useState("all");

  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [types, setTypes] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [error, setError] = useState({ summary: false, sla: false, activity: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { filterBy };

        const [summaryRes, slaRes, activityRes, typesRes, statusRes, priorityRes, trendsRes] = await Promise.all([
          API.get("/tickets/dashboard/summary", { params }),
          API.get("/tickets/sla-stats", { params }),
          API.get("/tickets/activity-log", { params }),
          API.get("/tickets/dashboard/types", { params }),
          API.get("/tickets/dashboard/status", { params }),
          API.get("/tickets/dashboard/priorities", { params }),
          API.get("/tickets/dashboard/monthly-trends", { params })
        ]);

        setSummary(summaryRes.data);
        setSlaStats(slaRes.data);
        setActivityLog(activityRes.data);
        setTypes(typesRes.data);
        setStatusData(statusRes.data);
        setPriorityData(priorityRes.data);
        setMonthlyTrends(trendsRes.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError({ summary: true, sla: true, activity: true });
      }
    };

    fetchData();
  }, [filterBy]);

  const summaryData = [
    { name: "Total", value: summary?.total || 0 },
    { name: "Open", value: summary?.open || 0 },
    { name: "Closed", value: summary?.closed || 0 }
  ];

  const COLORS = ["#34d399", "#fbbf24", "#60a5fa", "#f87171", "#a78bfa", "#f472b6"];

  return (
    <div className="p-6 text-gray-900 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="all">🌐 All Tickets</option>
          <option value="mine">👤 My Tickets</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Total */}
        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 shadow-2xl overflow-hidden transition transform hover:scale-[1.015]">
          <div className="absolute w-24 h-24 bg-white/10 rounded-full top-[-20px] right-[-20px] blur-2xl" />
          <h2 className="font-semibold text-xl relative z-10">Total Tickets</h2>
          <p className="text-3xl mt-2 font-bold relative z-10">{summary?.total ?? 0}</p>
        </div>

        {/* Open */}
        <div className="relative bg-gradient-to-br from-orange-400 to-yellow-200 rounded-xl p-5 shadow-2xl overflow-hidden transition transform hover:scale-[1.015]">
          <div className="absolute w-24 h-24 bg-white/20 rounded-full top-[-20px] right-[-20px] blur-2xl" />
          <h2 className="font-semibold text-xl relative z-10">Open</h2>
          <p className="text-3xl mt-2 font-bold relative z-10">{summary?.open ?? 0}</p>
        </div>

        {/* Closed */}
        <div className="relative bg-gradient-to-br from-green-500 to-lime-500 rounded-xl p-5 shadow-2xl overflow-hidden transition transform hover:scale-[1.015]">
          <div className="absolute w-24 h-24 bg-white/10 rounded-full top-[-20px] right-[-20px] blur-2xl" />
          <h2 className="font-semibold text-xl relative z-10">Closed</h2>
          <p className="text-3xl mt-2 font-bold relative z-10">{summary?.closed ?? 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Types Pie */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={types} dataKey="count" nameKey="type" outerRadius={80} label>
              {types.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Status Bar */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#68a1ff" />
          </BarChart>
        </ResponsiveContainer>

        {/* Priority Pie */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={priorityData} dataKey="count" nameKey="priority" innerRadius={40} outerRadius={70} label>
              {priorityData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Trends + SLA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyTrends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="80%" height={200}>
          <PieChart>
            <Pie
              data={[
                { name: "Compliant", value: slaStats?.slaCompliancePercent || 0 },
                { name: "Violation", value: 100 - (slaStats?.slaCompliancePercent || 0) }
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              label
            >
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
