import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiEye, FiEyeOff, FiUser, FiShield, FiSettings, FiUsers } from "react-icons/fi";

const TestCredentialsHelper = ({ onCredentialSelect, onQuickLogin }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const testCredentials = [
    {
      role: "Super Admin",
      email: "admin@ticxnova.com",
      password: "admin123",
      description: "Full system access with all permissions",
      icon: <FiShield className="w-5 h-5" />,
      gradient: "from-red-500 to-pink-600",
      permissions: ["All Modules", "User Management", "System Settings", "Reports"]
    },
    {
      role: "Department Manager",
      email: "manager@ticxnova.com",
      password: "manager123",
      description: "Department-level management and oversight",
      icon: <FiUsers className="w-5 h-5" />,
      gradient: "from-blue-500 to-indigo-600",
      permissions: ["Team Management", "Ticket Assignment", "Department Reports"]
    },
    {
      role: "Support Agent",
      email: "agent@ticxnova.com",
      password: "agent123",
      description: "Ticket handling and customer support",
      icon: <FiSettings className="w-5 h-5" />,
      gradient: "from-green-500 to-teal-600",
      permissions: ["Ticket Management", "Customer Communication", "Knowledge Base"]
    },
    {
      role: "End User",
      email: "user@ticxnova.com",
      password: "user123",
      description: "Basic user access for ticket creation",
      icon: <FiUser className="w-5 h-5" />,
      gradient: "from-purple-500 to-violet-600",
      permissions: ["Create Tickets", "View Own Tickets", "Basic Reports"]
    }
  ];

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🧪 Test Credentials</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
        >
          {showPasswords ? <FiEyeOff /> : <FiEye />}
          {showPasswords ? "Hide" : "Show"} Passwords
        </motion.button>
      </div>

      <div className="grid gap-3">
        {testCredentials.map((cred, index) => (
          <motion.div
            key={cred.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-4 bg-gradient-to-r ${cred.gradient} rounded-xl shadow-lg overflow-hidden group`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {cred.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{cred.role}</h4>
                    <p className="text-sm text-white/80">{cred.description}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onQuickLogin(cred)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Quick Login
                </motion.button>
              </div>

              {/* Credentials */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-12">Email:</span>
                  <code className="flex-1 text-sm bg-black/20 px-2 py-1 rounded text-white font-mono">
                    {cred.email}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(cred.email, `email-${index}`)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <FiCopy className="w-3 h-3 text-white/70" />
                  </motion.button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-12">Pass:</span>
                  <code className="flex-1 text-sm bg-black/20 px-2 py-1 rounded text-white font-mono">
                    {showPasswords ? cred.password : "••••••••"}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(cred.password, `password-${index}`)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <FiCopy className="w-3 h-3 text-white/70" />
                  </motion.button>
                </div>
              </div>

              {/* Permissions */}
              <div className="flex flex-wrap gap-1">
                {cred.permissions.map((permission, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-white/20 rounded-full text-white/80"
                  >
                    {permission}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCredentialSelect(cred)}
                  className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Fill Form
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onQuickLogin(cred)}
                  className="flex-1 py-2 bg-white hover:bg-white/90 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Login Now
                </motion.button>
              </div>
            </div>

            {/* Copy Success Indicator */}
            <AnimatePresence>
              {(copiedField === `email-${index}` || copiedField === `password-${index}`) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg"
                >
                  Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Usage Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
      >
        <h4 className="font-semibold text-white mb-2">💡 How to Use</h4>
        <ul className="text-sm text-white/70 space-y-1">
          <li>• Click "Fill Form" to auto-populate the login fields</li>
          <li>• Click "Login Now" for instant authentication</li>
          <li>• Use copy buttons to copy credentials manually</li>
          <li>• Each role has different access levels and permissions</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default TestCredentialsHelper;