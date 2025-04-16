// src/components/AIChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hi there! I’m TicxBot. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate a bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "🤖 I'm still learning. In the future, I’ll help with ticketing, SLA tracking, and more." },
      ]);
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-80 h-[420px] bg-white text-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <FaRobot /> TicxBot
              </h2>
              <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm bg-white">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-xl max-w-[90%] ${
                    msg.type === "user"
                      ? "bg-blue-100 self-end ml-auto text-right"
                      : "bg-gray-200 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-2 rounded-lg hover:opacity-90"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-all animate-bounce"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaRobot />
        </motion.button>
      )}
    </div>
  );
};

export default AIChatBot;
