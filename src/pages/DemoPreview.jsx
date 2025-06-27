import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ticxnova-logo.png";
import AdvancedDashboard from "../components/AdvancedDashboard";
import EnhancedTicketCard from "../components/EnhancedTicketCard";
import LoadingSpinner from "../components/LoadingSpinner";
import NotificationToast from "../components/NotificationToast";
import { useNotifications } from "../hooks/useNotifications";

const DemoPreview = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState("dashboard");
  const { notifications, addNotification, removeNotification } = useNotifications();

  const demoTickets = [
    {
      id: 1,
      ticketId: "INC-2024-001",
      title: "Network connectivity issues in Building A",
      status: "Open",
      priority: "P1",
      assignedTo: "john.doe@company.com",
      department: "IT",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      ticketId: "SR-2024-002", 
      title: "Request for new software installation",
      status: "In Progress",
      priority: "P2",
      assignedTo: "jane.smith@company.com",
      department: "HR",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      ticketId: "CHG-2024-003",
      title: "Server maintenance scheduled for weekend",
      status: "Completed",
      priority: "P3",
      assignedTo: "admin@company.com",
      department: "IT",
      createdAt: new Date().toISOString()
    }
  ];

  const demoFeatures = [
    {
      id: "dashboard",
      title: "🚀 Advanced Dashboard",
      description: "Real-time analytics with stunning visualizations",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "tickets",
      title: "🎫 Enhanced Ticket Cards",
      description: "Beautiful 3D hover effects and animations",
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: "notifications",
      title: "🔔 Smart Notifications",
      description: "Toast notifications with smooth animations",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: "loading",
      title: "⚡ Loading States",
      description: "Elegant loading spinners and transitions",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const showDemoNotification = () => {
    addNotification({
      type: 'success',
      title: 'Demo Notification',
      message: 'This is how notifications look in the enhanced UI!',
      duration: 4000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <img src={logo} alt="Ticxnova" className="h-24 w-24 mx-auto rounded-full shadow-2xl ring-4 ring-white/20" />
            </motion.div>

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              TICXNOVA
            </h1>
            <p className="text-2xl mb-4 text-blue-200">
              AI-Powered Ticketing Platform
            </p>
            <p className="text-lg mb-12 text-gray-300 max-w-3xl mx-auto">
              Experience the most advanced, beautiful, and powerful ticketing system with mind-blowing animations, 
              real-time analytics, and cutting-edge UI/UX design that will absolutely amaze you!
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                🚀 Go to Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showDemoNotification}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
              >
                🎯 Try Demo Features
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
        >
          ✨ Mind-Blowing Features
        </motion.h2>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {demoFeatures.map((feature) => (
            <motion.button
              key={feature.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDemo(feature.id)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeDemo === feature.id
                  ? `bg-gradient-to-r ${feature.gradient} shadow-2xl`
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {feature.title}
            </motion.button>
          ))}
        </div>

        {/* Demo Content */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          {activeDemo === "dashboard" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-center">🚀 Advanced Dashboard Preview</h3>
              <p className="text-center text-gray-300 mb-8">
                Real-time analytics with stunning charts, animated metrics, and live data updates
              </p>
              <div className="bg-white rounded-2xl p-4 text-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { title: "Total Tickets", value: "1,247", change: "+12%", icon: "🎫", color: "from-blue-500 to-blue-700" },
                    { title: "Open Issues", value: "89", change: "-5%", icon: "📋", color: "from-orange-500 to-red-500" },
                    { title: "Resolved", value: "1,158", change: "+18%", icon: "✅", color: "from-green-500 to-emerald-600" },
                    { title: "SLA Score", value: "98.5%", change: "+2%", icon: "🎯", color: "from-purple-500 to-pink-600" }
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{metric.icon}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{metric.change}</span>
                      </div>
                      <h4 className="text-sm opacity-90">{metric.title}</h4>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center text-gray-500">
                  <p>📊 Interactive charts and real-time data visualization would appear here</p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === "tickets" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-center">🎫 Enhanced Ticket Cards</h3>
              <p className="text-center text-gray-300 mb-8">
                Beautiful 3D hover effects, smooth animations, and intuitive design
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoTickets.map((ticket, index) => (
                  <EnhancedTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    index={index}
                    onClick={() => showDemoNotification()}
                  />
                ))}
              </div>
            </div>
          )}

          {activeDemo === "notifications" && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">🔔 Smart Notification System</h3>
              <p className="text-gray-300 mb-8">
                Beautiful toast notifications with smooth animations and auto-dismiss
              </p>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addNotification({
                    type: 'success',
                    title: 'Success!',
                    message: 'Your ticket has been created successfully.',
                    duration: 4000
                  })}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition-colors"
                >
                  Show Success Notification
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addNotification({
                    type: 'error',
                    title: 'Error!',
                    message: 'Something went wrong. Please try again.',
                    duration: 4000
                  })}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-colors ml-4"
                >
                  Show Error Notification
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addNotification({
                    type: 'warning',
                    title: 'Warning!',
                    message: 'Your session will expire in 5 minutes.',
                    duration: 4000
                  })}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold transition-colors ml-4"
                >
                  Show Warning
                </motion.button>
              </div>
            </div>
          )}

          {activeDemo === "loading" && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">⚡ Elegant Loading States</h3>
              <p className="text-gray-300 mb-8">
                Beautiful loading spinners with smooth animations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6">
                  <h4 className="text-gray-800 font-semibold mb-4">Small Spinner</h4>
                  <LoadingSpinner size="small" text="Loading..." />
                </div>
                <div className="bg-white rounded-xl p-6">
                  <h4 className="text-gray-800 font-semibold mb-4">Medium Spinner</h4>
                  <LoadingSpinner size="medium" text="Processing..." />
                </div>
                <div className="bg-white rounded-xl p-6">
                  <h4 className="text-gray-800 font-semibold mb-4">Large Spinner</h4>
                  <LoadingSpinner size="large" text="Initializing..." />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations using Ticxnova's AI-powered platform for seamless ticket management.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            🚀 Start Your Journey
          </motion.button>
        </motion.div>
      </div>

      {/* Notification System */}
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default DemoPreview;