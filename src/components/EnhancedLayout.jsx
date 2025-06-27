import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMsal } from "@azure/msal-react";
import logo from "../assets/ticxnova-logo.png";
import AIChatBot from "./AIChatBot";

const EnhancedLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(3);
  const { instance } = useMsal();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/dashboard",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: "🎫",
      gradient: "from-green-500 to-teal-600",
      submenu: [
        { label: "Create Ticket", path: "/create-ticket", icon: "➕" },
        { label: "All Tickets", path: "/all-tickets", icon: "📁" },
        { label: "SLA Tracker", path: "/slatracker", icon: "🎯" }
      ]
    },
    {
      id: "management",
      label: "Management",
      icon: "👥",
      gradient: "from-orange-500 to-red-600",
      submenu: [
        { label: "Users", path: "/users", icon: "👤" },
        { label: "Asset Management", path: "/assetmanagement", icon: "📦" },
        { label: "Admin Panel", path: "/adminpanel", icon: "🛠️" }
      ]
    },
    {
      id: "knowledge",
      label: "Knowledge",
      icon: "📚",
      path: "/knowledgebase",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: "reports",
      label: "Reports",
      icon: "📈",
      path: "/reports",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: "communication",
      label: "Communication",
      icon: "💬",
      gradient: "from-teal-500 to-cyan-600",
      submenu: [
        { label: "Messages", path: "/messages", icon: "📨" },
        { label: "Notifications", path: "/notifications", icon: "🔔" },
        { label: "Email Templates", path: "/emailtemplates", icon: "📬" }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      path: "/settings",
      gradient: "from-gray-500 to-slate-600"
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(decoded.name || "User");
      } catch (err) {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    const loginMethod = localStorage.getItem("loginMethod");
    localStorage.removeItem("token");
    localStorage.removeItem("loginMethod");
    if (setAuth) setAuth(false);
    if (loginMethod === "microsoft") {
      instance.logoutRedirect();
    } else {
      window.location.href = "/";
    }
  };

  const toggleSubmenu = (menuId) => {
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Enhanced Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-12 w-12 rounded-full shadow-lg ring-2 ring-white/30"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TICXNOVA
                  </h2>
                  <p className="text-xs text-gray-400">AI-Powered Platform</p>
                </div>
              )}
            </motion.div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ◀
              </motion.div>
            </button>
          </div>

          {/* User Profile */}
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto" }}
            className="mb-6 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border-2 border-white/30"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group cursor-pointer rounded-xl transition-all duration-200 ${
                    isActive(item.path) ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                  }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleSubmenu(item.id);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg`}>
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {!isCollapsed && item.submenu && (
                      <motion.div
                        animate={{ rotate: activeSubmenu === item.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▶
                      </motion.div>
                    )}
                    {item.id === 'communication' && notifications > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        {notifications}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Submenu */}
                <AnimatePresence>
                  {!isCollapsed && item.submenu && activeSubmenu === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 mt-2 space-y-1"
                    >
                      {item.submenu.map((subItem) => (
                        <motion.div
                          key={subItem.path}
                          whileHover={{ x: 5 }}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                            isActive(subItem.path) ? 'bg-white/20 text-blue-300' : 'hover:bg-white/10'
                          }`}
                          onClick={() => navigate(subItem.path)}
                        >
                          <span className="text-lg">{subItem.icon}</span>
                          <span className="text-sm">{subItem.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full mt-8 p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isCollapsed ? "🔓" : "🔓 Logout"}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard'}
              </h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">System Online</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="relative">
                <button className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
                  🔔
                </button>
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
                    {notifications}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedLayout;