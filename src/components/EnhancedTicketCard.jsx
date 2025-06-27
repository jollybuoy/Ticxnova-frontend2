import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiTag, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";

const EnhancedTicketCard = ({ ticket, onClick, index }) => {
  const priorityColors = {
    P1: "from-red-500 to-red-700",
    P2: "from-orange-500 to-orange-700", 
    P3: "from-yellow-500 to-yellow-700",
    P4: "from-green-500 to-green-700"
  };

  const statusColors = {
    Open: "bg-blue-500",
    "In Progress": "bg-yellow-500",
    Completed: "bg-green-500",
    Closed: "bg-gray-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        rotateX: 2
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 cursor-pointer overflow-hidden group"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Priority Indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${priorityColors[ticket.priority] || priorityColors.P3}`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <FiTag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                {ticket.ticketId}
              </h3>
              <p className="text-sm text-gray-500">#{ticket.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[ticket.status]}`}>
              {ticket.status}
            </span>
            <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${priorityColors[ticket.priority]} text-white text-xs font-bold`}>
              {ticket.priority}
            </div>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-gray-800 font-semibold mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {ticket.title}
        </h4>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUser className="w-4 h-4 text-blue-500" />
            <span className="truncate">{ticket.assignedTo || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4 text-green-500" />
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Department Tag */}
        {ticket.department && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 mb-3">
            <FiTrendingUp className="w-3 h-3" />
            {ticket.department}
          </div>
        )}

        {/* Progress Bar (if applicable) */}
        {ticket.status === "In Progress" && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              ></motion.div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {ticket.priority === "P1" && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <FiAlertTriangle className="w-3 h-3" />
                <span>Urgent</span>
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className="text-blue-500 text-sm font-medium"
          >
            View Details →
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default EnhancedTicketCard;