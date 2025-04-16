// src/components/AIChatBot.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your AI Assistant. How can I help you today?" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Placeholder AI response (we'll replace this with OpenAI backend later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `You said: "${input}". Let me process that... (AI coming soon)`,
        },
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full text-white shadow-lg hover:scale-110 transition"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-[28rem] bg-white rounded-2xl shadow-xl p-4 flex flex-col mt-4"
          >
            <h2 className="text-lg font-bold mb-2 text-purple-600">🤖 AI Assistant</h2>

            <div className="flex-1 overflow-y-auto space-y-3 text-sm text-gray-800 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg w-fit max-w-[85%] ${
                    msg.from === "user"
                      ? "ml-auto bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex mt-4 gap-2">
              <input
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md"
              >
                <FiSend />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatBot;
