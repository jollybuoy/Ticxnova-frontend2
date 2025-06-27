import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMessageSquare, FiSettings, FiHelpCircle, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: <FiPlus />,
      label: "Create Ticket",
      color: "from-blue-500 to-blue-700",
      action: () => navigate("/create-ticket")
    },
    {
      icon: <FiMessageSquare />,
      label: "Messages",
      color: "from-green-500 to-green-700",
      action: () => navigate("/messages")
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      color: "from-purple-500 to-purple-700",
      action: () => navigate("/settings")
    },
    {
      icon: <FiHelpCircle />,
      label: "Help",
      color: "from-orange-500 to-orange-700",
      action: () => navigate("/knowledgebase")
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.5 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: -5 }}
                className="flex items-center gap-3"
              >
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                  {action.label}
                </div>
                <button
                  onClick={action.action}
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200`}
                >
                  {action.icon}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FiPlus size={24} />}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;