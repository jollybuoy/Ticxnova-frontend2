// src/components/AIChatBot.jsx (Ticxnova AI Assistant with Voice Input + Modern UI + History + Context Awareness)
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation } from "react-router-dom";

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AIChatBot = ({ isOpen, onClose, token }) => {
  const location = useLocation();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("ticxbot-history");
    return saved ? JSON.parse(saved) : [
      { role: "bot", text: "👋 Welcome to <b>Ticxnova AI</b>. How can I help you today?" }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const quickActions = [
    "🔍 Show my open tickets",
    "➕ Create a new ticket",
    "📈 SLA compliance report",
    "✅ Last 5 closed tickets"
  ];

  useEffect(() => {
    localStorage.setItem("ticxbot-history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        setInput(speech);
        setListening(false);
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoice = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

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
        { message: textToSend, page: location.pathname },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const reply = res.data?.reply || "❌ Sorry, I couldn't understand that.";
      const previewCard = res.data?.preview;

      const botResponse = [{ role: "bot", text: reply }];
      if (previewCard) {
        botResponse.push({ role: "preview", data: previewCard });
      }

      setMessages([...newMessages, ...botResponse]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "⚠️ Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearHistory = () => {
    localStorage.removeItem("ticxbot-history");
    setMessages([{ role: "bot", text: "🧠 Chat cleared. How can I assist you now?" }]);
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-[420px] bg-gradient-to-b from-zinc-900 to-zinc-800 text-white shadow-2xl z-50 border-l border-zinc-700"
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-900">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <h2 className="text-xl font-bold">Ticxnova AI</h2>
        </div>
        <button onClick={onClose} aria-label="Close panel">
          <XIcon />
        </button>
      </div>

      <div className="p-4 flex flex-wrap gap-2 border-b border-zinc-700 justify-between">
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              className="px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 rounded-full"
              onClick={() => sendMessage(qa)}
            >
              {qa}
            </button>
          ))}
        </div>
        <button onClick={clearHistory} className="text-xs text-zinc-400 underline hover:text-white ml-auto">Clear Chat</button>
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
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                  msg.role === "user" ? "ml-auto bg-blue-600" : "bg-zinc-800"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-700 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full px-4 py-2 rounded-full bg-zinc-800 text-white outline-none border border-zinc-700 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleVoice}
          className={`rounded-full p-2 ${listening ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
          title="Voice input"
        >
          🎤
        </button>
      </div>
      {loading && <div className="text-xs text-zinc-400 px-4 pb-2 animate-pulse">Thinking...</div>}
    </motion.div>
  );
};

export default AIChatBot;
