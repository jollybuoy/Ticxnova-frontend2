import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiAlertCircle } from "react-icons/fi";

const NotificationToast = ({ notifications, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheck className="w-5 h-5" />;
      case 'error': return <FiAlertCircle className="w-5 h-5" />;
      case 'warning': return <FiAlertTriangle className="w-5 h-5" />;
      default: return <FiInfo className="w-5 h-5" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'from-green-500 to-emerald-600 text-white';
      case 'error': return 'from-red-500 to-red-600 text-white';
      case 'warning': return 'from-yellow-500 to-orange-500 text-white';
      default: return 'from-blue-500 to-blue-600 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative p-4 rounded-xl shadow-2xl backdrop-blur-lg bg-gradient-to-r ${getColors(notification.type)} min-w-80 max-w-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm opacity-90 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: notification.duration || 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;