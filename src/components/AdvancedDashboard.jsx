import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar
} from "recharts";

const AdvancedDashboard = () => {
  const [filterBy, setFilterBy] = useState("all");
  const [summary, setSummary] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [types, setTypes] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => [
        ...prev.slice(-9),
        {
          time: new Date().toLocaleTimeString(),
          value: Math.floor(Math.random() * 100) + 50,
          tickets: Math.floor(Math.random() * 10) + 1
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
      }
    };

    fetchData();
  }, [filterBy]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", "#d084d0"];

  const MetricCard = ({ title, value, change, icon, gradient, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl overflow-hidden group cursor-pointer`}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl opacity-80">{icon}</div>
          {change && (
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              change.startsWith('+') ? 'bg-green-500/30' : 'bg-red-500/30'
            }`}>
              {change}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold opacity-90 mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Real-time insights and analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white shadow-lg border-0 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">🌐 All Tickets</option>
            <option value="mine">👤 My Tickets</option>
          </select>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Tickets"
          value={summary?.total || 0}
          change="+12%"
          icon="🎫"
          gradient="from-blue-500 to-blue-700"
          delay={0}
        />
        <MetricCard
          title="Open Tickets"
          value={summary?.open || 0}
          change="-5%"
          icon="📋"
          gradient="from-orange-500 to-red-500"
          delay={0.1}
        />
        <MetricCard
          title="Resolved Today"
          value={summary?.closed || 0}
          change="+18%"
          icon="✅"
          gradient="from-green-500 to-emerald-600"
          delay={0.2}
        />
        <MetricCard
          title="SLA Compliance"
          value={`${slaStats?.slaCompliancePercent || 95}%`}
          change="+3%"
          icon="🎯"
          gradient="from-purple-500 to-pink-600"
          delay={0.3}
        />
      </div>

      {/* Real-time Activity */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          Real-time Activity
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={realTimeData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorGradient)"
              strokeWidth={3}
            />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* 3D Pie Chart */}
        <motion.div
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl"
        >
          <h3 className="text-xl font-bold mb-4">Ticket Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={types}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
                dataKey="count"
                nameKey="type"
              >
                {types.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radial Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl"
        >
          <h3 className="text-xl font-bold mb-4">SLA Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
              { name: 'SLA', value: slaStats?.slaCompliancePercent || 95, fill: '#8884d8' }
            ]}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {slaStats?.slaCompliancePercent || 95}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Animated Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl"
        >
          <h3 className="text-xl font-bold mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Monthly Trends Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {activityLog.slice(0, 5).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action || "Ticket updated"}</p>
                <p className="text-xs text-gray-500">{activity.timestamp || "Just now"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedDashboard;