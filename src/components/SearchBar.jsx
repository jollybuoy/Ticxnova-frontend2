import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCommand, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const searchData = [
    { title: "Create New Ticket", path: "/create-ticket", icon: "➕", category: "Actions" },
    { title: "View All Tickets", path: "/all-tickets", icon: "📁", category: "Navigation" },
    { title: "Dashboard", path: "/dashboard", icon: "📊", category: "Navigation" },
    { title: "User Management", path: "/users", icon: "👥", category: "Management" },
    { title: "Reports & Analytics", path: "/reports", icon: "📈", category: "Analytics" },
    { title: "Knowledge Base", path: "/knowledgebase", icon: "📚", category: "Resources" },
    { title: "Settings", path: "/settings", icon: "⚙️", category: "Configuration" },
    { title: "SLA Tracker", path: "/slatracker", icon: "🎯", category: "Monitoring" }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(searchData.slice(0, 6));
    }
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300 transition-all"
      >
        <FiSearch className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <div className="flex items-center gap-1 ml-auto">
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded border">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded border">K</kbd>
        </div>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <FiSearch className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="flex-1 text-lg outline-none placeholder-gray-400"
                />
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">ESC</kbd>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {results.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(item)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <FiSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No results found for "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white rounded border">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white rounded border">↵</kbd>
                    Select
                  </span>
                </div>
                <span>Powered by Ticxnova AI</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;