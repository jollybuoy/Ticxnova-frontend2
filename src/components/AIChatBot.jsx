// src/components/AIChatBot.jsx (Advanced AI Panel with Ticket Preview)
import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const AIChatBot = ({ isOpen, onClose, token }) => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! I’m your Smart Assistant. Ask me anything about your tickets." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickActions = [
    "Show my open tickets",
    "Create a new ticket",
    "SLA compliance report",
    "Last 5 closed tickets"
  ];

  const sendMessage = async (msg) => {
    const textToSend = msg || input;
    if (!textToSend.trim()) return;
    const newMessages = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/aichat/ask`,
        { message: textToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const reply = res.data?.reply || "Sorry, I couldn't understand that.";
      const previewCard = res.data?.preview; // optional preview card

      const botResponse = [{ role: "bot", text: reply }];

      if (previewCard) {
        botResponse.push({ role: "preview", data: previewCard });
      }

      setMessages([...newMessages, ...botResponse]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "❌ Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-[400px] bg-zinc-900 text-white shadow-2xl z-50 border-l border-zinc-700"
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-zinc-700">
        <h2 className="text-lg font-bold">🤖 Smart IT Assistant</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-wrap gap-2 border-b border-zinc-700">
        {quickActions.map((qa, i) => (
          <button
            key={i}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-full"
            onClick={() => sendMessage(qa)}
          >
            {qa}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-4 overflow-y-auto h-[60%]">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "preview" ? (
              <div className="border border-zinc-700 bg-zinc-800 rounded-xl p-3 text-sm">
                <p className="font-semibold">📌 Ticket Preview</p>
                <p><strong>ID:</strong> {msg.data.id}</p>
                <p><strong>Title:</strong> {msg.data.title}</p>
                <p><strong>Status:</strong> {msg.data.status}</p>
                <p><strong>Assigned To:</strong> {msg.data.assignedTo}</p>
              </div>
            ) : (
              <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user" ? "ml-auto bg-blue-600" : "bg-zinc-800"}`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className="w-full px-4 py-2 rounded-full bg-zinc-800 text-white outline-none"
        />
        {loading && <div className="text-xs text-zinc-400 mt-1">Thinking...</div>}
      </div>
    </motion.div>
  );
};

export default AIChatBot;
