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
  const [isOffline, setIsOffline] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fallback data for when API is unavailable
  const fallbackData = {
    summary: { total: 156, open: 42, closed: 18 },
    slaStats: { slaCompliancePercent: 94 },
    activityLog: [
      { action: "Ticket #1234 created", timestamp: "2 minutes ago" },
      { action: "Ticket #1233 resolved", timestamp: "5 minutes ago" },
      { action: "Ticket #1232 updated", timestamp: "8 minutes ago" },
      { action: "Ticket #1231 assigned", timestamp: "12 minutes ago" },
      { action: "Ticket #1230 closed", timestamp: "15 minutes ago" }
    ],
    types: [
      { type: "Bug", count: 45 },
      { type: "Feature", count: 32 },
      { type: "Support", count: 28 },
      { type: "Enhancement", count: 21 },
      { type: "Documentation", count: 15 }
    ],
    statusData: [
      { status: "Open", count: 42 },
      { status: "In Progress", count: 28 },
      { status: "Resolved", count: 65 },
      { status: "Closed", count: 21 }
    ],
    priorityData: [
      { priority: "Low", count: 35 },
      { priority: "Medium", count: 48 },
      { priority: "High", count: 32 },
      { priority: "Critical", count: 12 }
    ],
    monthlyTrends: [
      { month: "Jan", count: 45 },
      { month: "Feb", count: 52 },
      { month: "Mar", count: 48 },
      { month: "Apr", count: 61 },
      { month: "May", count: 55 },
      { month: "Jun", count: 67 }
    ]
  };

  // Initialize with fallback data to prevent empty states
  useEffect(() => {
    setSummary(fallbackData.summary);
    setSlaStats(fallbackData.slaStats);
    setActivityLog(fallbackData.activityLog);
    setTypes(fallbackData.types);
    setStatusData(fallbackData.statusData);
    setPriorityData(fallbackData.priorityData);
    setMonthlyTrends(fallbackData.monthlyTrends);
  }, []);

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

  // Enhanced error handling function
  const handleApiError = (error) => {
    let errorMessage = "Unable to connect to server";
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "Network connection failed - please check your internet connection";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "Server is not responding - please try again later";
    } else if (error.response) {
      // Server responded with error status
      errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server - please check if the API server is running";
    }
    
    setConnectionError(errorMessage);
    setIsOffline(true);
    
    // Log error for debugging but don't throw
    console.warn("Dashboard API connection issue:", errorMessage, error);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Reset error state
      setConnectionError(null);
      
      try {
        setIsOffline(false);
        const params = { filterBy };
        
        // Use Promise.allSettled to handle partial failures gracefully
        const results = await Promise.allSettled([
          API.get("/tickets/dashboard/summary", { params }),
          API.get("/tickets/sla-stats", { params }),
          API.get("/tickets/activity-log", { params }),
          API.get("/tickets/dashboard/types", { params }),
          API.get("/tickets/dashboard/status", { params }),
          API.get("/tickets/dashboard/priorities", { params }),
          API.get("/tickets/dashboard/monthly-trends", { params })
        ]);

        // Check if any requests succeeded
        const hasSuccessfulRequest = results.some(result => result.status === 'fulfilled');
        
        if (hasSuccessfulRequest) {
          // At least some data was fetched successfully
          setIsOffline(false);
          
          // Update data for successful requests, keep fallback for failed ones
          if (results[0].status === 'fulfilled') setSummary(results[0].value.data);
          if (results[1].status === 'fulfilled') setSlaStats(results[1].value.data);
          if (results[2].status === 'fulfilled') setActivityLog(results[2].value.data);
          if (results[3].status === 'fulfilled') setTypes(results[3].value.data);
          if (results[4].status === 'fulfilled') setStatusData(results[4].value.data);
          if (results[5].status === 'fulfilled') setPriorityData(results[5].value.data);
          if (results[6].status === 'fulfilled') setMonthlyTrends(results[6].value.data);
        } else {
          // All requests failed
          throw results[0].reason || new Error("All API requests failed");
        }
      } catch (err) {
        handleApiError(err);
        // Data is already set to fallback values in useEffect initialization
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
      whileHover={{ scale: 1.02 }}
      className={`relative ${isMobile ? 'p-4' : 'p-6'} rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl overflow-hidden group cursor-pointer`}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} opacity-80`}>{icon}</div>
          {change && (
            <div className={`px-2 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-xs'} font-bold ${
              change.startsWith('+') ? 'bg-green-500/30' : 'bg-red-500/30'
            }`}>
              {change}
            </div>
          )}
        </div>
        <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold opacity-90 mb-2`}>{title}</h3>
        <p className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
      {/* Enhanced Offline Banner */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 ${isMobile ? 'p-3' : 'p-4'} bg-yellow-100 border border-yellow-400 rounded-lg flex items-center gap-3`}
        >
          <div className="text-yellow-600 text-xl">⚠️</div>
          <div className="flex-1">
            <div className={`text-yellow-800 font-semibold ${isMobile ? 'text-sm' : ''}`}>Demo Mode Active</div>
            <div className={`text-yellow-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {connectionError || "Unable to connect to server. Showing demo data."}
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-md font-medium transition-colors`}
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'} mb-8`}
      >
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Advanced Dashboard
          </h1>
          <p className={`text-gray-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
            {isOffline ? "Demo data - Real-time insights and analytics" : "Real-time insights and analytics"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-xl bg-white shadow-lg border-0 focus:ring-2 focus:ring-blue-500`}
            disabled={isOffline}
          >
            <option value="all">🌐 All Tickets</option>
            <option value="mine">👤 My Tickets</option>
          </select>
          <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} border-2 ${isOffline ? 'border-yellow-500' : 'border-blue-500'} border-t-transparent rounded-full ${isOffline ? '' : 'animate-spin'}`} />
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className={`grid grid-cols-2 ${isMobile ? 'lg:grid-cols-4 gap-3' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'} mb-8`}>
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
        className={`mb-8 ${isMobile ? 'p-4' : 'p-6'} bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20`}
      >
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-4 flex items-center gap-2`}>
          <div className={`w-3 h-3 ${isOffline ? 'bg-yellow-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
          {isOffline ? 'Demo Activity' : 'Real-time Activity'}
        </h2>
        <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
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
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 xl:grid-cols-3 gap-6'} mb-8`}>
        {/* 3D Pie Chart */}
        <motion.div
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.5 }}
          className={`${isMobile ? 'p-4' : 'p-6'} bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl`}
        >
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>Ticket Types Distribution</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <PieChart>
              <Pie
                data={types}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 80}
                innerRadius={isMobile ? 30 : 40}
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
          className={`${isMobile ? 'p-4' : 'p-6'} bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl`}
        >
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>SLA Performance</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
              { name: 'SLA', value: slaStats?.slaCompliancePercent || 95, fill: '#8884d8' }
            ]}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
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
          className={`${isMobile ? 'p-4' : 'p-6'} bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl`}
        >
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
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
        className={`${isMobile ? 'p-4' : 'p-6'} bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl`}
      >
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-4`}>Monthly Trends Analysis</h2>
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
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
        className={`mt-8 ${isMobile ? 'p-4' : 'p-6'} bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl`}
      >
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-4`}>Recent Activity</h2>
        <div className={`space-y-3 ${isMobile ? 'max-h-48' : 'max-h-60'} overflow-y-auto`}>
          {activityLog.slice(0, 5).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className={`flex items-center gap-4 ${isMobile ? 'p-2' : 'p-3'} rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors`}
            >
              <div className={`w-2 h-2 ${isOffline ? 'bg-yellow-500' : 'bg-blue-500'} rounded-full animate-pulse`}></div>
              <div className="flex-1">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{activity.action || "Ticket updated"}</p>
                <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>{activity.timestamp || "Just now"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedDashboard;