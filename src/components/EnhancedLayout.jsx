import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMsal } from "@azure/msal-react";
import logo from "../assets/ticxnova-logo.png";
import AIChatBot from "./AIChatBot";
import UserPresenceChat from "./UserPresenceChat";

const EnhancedLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { instance } = useMsal();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Always collapsed on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate online users count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 3) + 4); // 4-6 users online
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/dashboard",
      gradient: "from-blue-500 via-blue-600 to-purple-600",
      description: "Analytics & Overview"
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: "🎫",
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      description: "Ticket Management",
      submenu: [
        { label: "Create Ticket", path: "/create-ticket", icon: "➕", description: "New ticket" },
        { label: "All Tickets", path: "/all-tickets", icon: "📁", description: "View all" },
        { label: "SLA Tracker", path: "/slatracker", icon: "🎯", description: "Track SLA" }
      ]
    },
    {
      id: "management",
      label: "Management",
      icon: "👥",
      gradient: "from-orange-500 via-red-500 to-pink-600",
      description: "System Management",
      submenu: [
        { label: "Users", path: "/users", icon: "👤", description: "User management" },
        { label: "Asset Management", path: "/assetmanagement", icon: "📦", description: "Assets" },
        { label: "Admin Panel", path: "/adminpanel", icon: "🛠️", description: "Admin tools" }
      ]
    },
    {
      id: "knowledge",
      label: "Knowledge",
      icon: "📚",
      path: "/knowledgebase",
      gradient: "from-purple-500 via-violet-600 to-indigo-600",
      description: "Knowledge Base"
    },
    {
      id: "reports",
      label: "Reports",
      icon: "📈",
      path: "/reports",
      gradient: "from-indigo-500 via-blue-600 to-cyan-600",
      description: "Analytics & Reports"
    },
    {
      id: "communication",
      label: "Communication",
      icon: "💬",
      gradient: "from-teal-500 via-cyan-600 to-blue-600",
      description: "Messages & Alerts",
      submenu: [
        { label: "Messages", path: "/messages", icon: "📨", description: "Email & chat" },
        { label: "Notifications", path: "/notifications", icon: "🔔", description: "Alerts" },
        { label: "Email Templates", path: "/emailtemplates", icon: "📬", description: "Templates" }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      path: "/settings",
      gradient: "from-gray-500 via-slate-600 to-gray-700",
      description: "System Settings"
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

  const handleMenuItemClick = (item) => {
    if (item.submenu) {
      toggleSubmenu(item.id);
    } else {
      navigate(item.path);
      if (isMobile) {
        setShowMobileMenu(false);
      }
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isMobile ? (showMobileMenu ? 280 : 0) : (isCollapsed ? 80 : 320),
          x: isMobile ? (showMobileMenu ? 0 : -280) : 0
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${isMobile ? 'fixed' : 'relative'} bg-white text-gray-800 shadow-2xl overflow-hidden border-r border-gray-200 z-50`}
        style={{ height: isMobile ? '100vh' : 'auto' }}
      >
        {/* Professional White Background with Subtle Patterns */}
        <div className="absolute inset-0">
          {/* Subtle geometric patterns */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                linear-gradient(-45deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          {/* Professional gradient overlays */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-50/30 to-transparent"></div>
          
          {/* Subtle animated elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.05, 0.02]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10 p-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              animate={{ opacity: (isCollapsed && !isMobile) ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <motion.img
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  src={logo}
                  alt="Logo"
                  className="h-14 w-14 rounded-full shadow-xl ring-2 ring-blue-200"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              </div>
              {(!isCollapsed || isMobile) && (
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    TICXNOVA
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">AI-Powered Platform</p>
                  <div className="text-xs text-blue-600 font-mono mt-1 bg-blue-50 px-2 py-1 rounded-md">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </motion.div>
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md border border-gray-200"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg text-gray-600"
                >
                  ◀
                </motion.div>
              </motion.button>
            )}
          </div>

          {/* Enhanced User Profile */}
          <motion.div
            animate={{ 
              opacity: (isCollapsed && !isMobile) ? 0 : 1, 
              height: (isCollapsed && !isMobile) ? 0 : "auto",
              marginBottom: (isCollapsed && !isMobile) ? 0 : 24
            }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 border border-blue-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3B82F6&color=fff&size=48`}
                  alt="Avatar"
                  className="h-12 w-12 rounded-full border-2 border-blue-200 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{userName}</p>
                <p className="text-xs text-gray-600">System Administrator</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Navigation Menu */}
          <nav className="space-y-3">
            {menuItems.map((item, index) => (
              <div key={item.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg border border-blue-200' 
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl p-3 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300 text-white`}>
                        {item.icon}
                      </div>
                      {(!isCollapsed || isMobile) && (
                        <div>
                          <span className="font-semibold text-gray-800">{item.label}</span>
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        </div>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && item.submenu && (
                      <motion.div
                        animate={{ rotate: activeSubmenu === item.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500"
                      >
                        ▶
                      </motion.div>
                    )}
                    {item.id === 'communication' && notifications > 0 && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                      >
                        {notifications}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Enhanced Submenu */}
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && item.submenu && activeSubmenu === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 mt-3 space-y-2 overflow-hidden"
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <motion.div
                          key={subItem.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.1 }}
                          whileHover={{ x: 8, scale: 1.02 }}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            isActive(subItem.path) 
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-200' 
                              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:shadow-sm'
                          }`}
                          onClick={() => {
                            navigate(subItem.path);
                            if (isMobile) setShowMobileMenu(false);
                          }}
                        >
                          <span className="text-lg">{subItem.icon}</span>
                          <div>
                            <span className="text-sm font-medium">{subItem.label}</span>
                            <p className="text-xs opacity-70">{subItem.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Enhanced Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full mt-8 p-4 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-red-200 text-white"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🔓</span>
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Bar with Mobile Menu Button */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
                    <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
                    <span className="block w-5 h-0.5 bg-gray-600"></span>
                  </div>
                </motion.button>
              )}
              
              <div>
                <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  {location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard'}
                </h1>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: isMobile ? 'short' : 'long', 
                    year: 'numeric', 
                    month: isMobile ? 'short' : 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {!isMobile && (
                <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <span className="text-sm font-medium text-green-700">System Online</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors shadow-md border border-gray-200"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </motion.button>
              )}
              
              {/* Enhanced User Presence Button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 sm:gap-3 ${isMobile ? 'p-2' : 'p-3'} rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all shadow-md border border-blue-200 group`}
                >
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3B82F6&color=fff&size=32`}
                      alt="Avatar"
                      className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border-2 border-blue-200 shadow-sm group-hover:scale-110 transition-transform`}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  {!isMobile && (
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                          />
                          <span className="text-xs text-green-600 font-medium">{onlineUsers} online</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowChatWindow(true);
                            setShowUserDropdown(false);
                          }}
                          className="p-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all"
                        >
                          <span className="text-xs">💬</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                  
                  <motion.div
                    animate={{ rotate: showUserDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500"
                  >
                    ▼
                  </motion.div>
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className={`absolute top-full right-0 mt-2 ${isMobile ? 'w-56' : 'w-64'} bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden`}
                    >
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3B82F6&color=fff&size=48`}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-lg"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{userName}</p>
                            <p className="text-sm text-gray-600">System Administrator</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowChatWindow(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
                            💬
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Team Chat</p>
                            <p className="text-xs text-gray-500">{onlineUsers} users online</p>
                          </div>
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate("/settings")}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left group"
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white group-hover:scale-110 transition-transform">
                            ⚙️
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Settings</p>
                            <p className="text-xs text-gray-500">Account preferences</p>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all text-left group"
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white group-hover:scale-110 transition-transform">
                            🔓
                          </div>
                          <div>
                            <p className="font-medium text-red-700">Logout</p>
                            <p className="text-xs text-red-500">Sign out of account</p>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${isMobile ? 'p-2' : 'p-3'} rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors shadow-md border border-blue-200`}
                >
                  🔔
                </motion.button>
                {notifications > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                  >
                    {notifications}
                  </motion.div>
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

      {/* Advanced Chat Window */}
      <AnimatePresence>
        {showChatWindow && (
          <UserPresenceChat
            currentUser={{ name: userName, email: localStorage.getItem("email") }}
            isOpen={showChatWindow}
            onClose={() => setShowChatWindow(false)}
          />
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {(showUserDropdown || showChatWindow) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserDropdown(false);
            if (!showChatWindow) setShowChatWindow(false);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedLayout;