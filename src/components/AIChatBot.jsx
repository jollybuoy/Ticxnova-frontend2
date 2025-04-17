// src/components/AIChatBot.jsx (Clean & Clickable Full Version with All Features)
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation } from "react-router-dom";

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      if (window.speechSynthesis && reply) {
        const voiceReply = new SpeechSynthesisUtterance(reply.replace(/<[^>]+>/g, ''));
        voiceReply.rate = 1;
        voiceReply.pitch = 1;
        window.speechSynthesis.speak(voiceReply);
      }
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

  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen && window.speechSynthesis) {
      const welcome = new SpeechSynthesisUtterance("Welcome to Ticxnova AI. How can I help you today?");
      const voices = window.speechSynthesis.getVoices();
      const softFemale = voices.find(v => /female|woman|girl/i.test(v.name) && v.lang.startsWith('en'));
      if (softFemale) welcome.voice = softFemale;
      welcome.rate = 1;
      welcome.pitch = 1.2;
      window.speechSynthesis.speak(welcome);
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-[420px] bg-white text-gray-900 shadow-2xl z-50 border-l border-gray-300 flex flex-col"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center animate-spin-slow relative">
  <div className="absolute top-1 left-0 w-full text-center">
  <span className="text-white text-xs font-semibold animate-pulse drop-shadow-lg tracking-wide animate-bounce bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">Ticxnova AI</span>
</div>
  <span className="text-3xl">🧠</span>
</div>
            
          </div>
          <h2 className="text-2xl font-bold text-blue-700">Ticxnova AI</h2>
        </div>
        <button onClick={onClose} aria-label="Close panel">
          <XIcon />
        </button>
      </div>

      <div className="p-4 flex flex-wrap gap-2 border-b border-gray-200 justify-between">
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-full"
              onClick={() => sendMessage(qa)}
            >
              {qa}
            </button>
          ))}
        </div>
        <button onClick={clearHistory} className="text-xs text-gray-500 underline hover:text-black ml-auto">Clear Chat</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "preview" ? (
              <div className="border border-gray-300 bg-gray-100 rounded-xl p-3 text-sm">
                <p className="font-semibold">📌 Ticket Preview</p>
                <p><strong>ID:</strong> {msg.data.id}</p>
                <p><strong>Title:</strong> {msg.data.title}</p>
                <p><strong>Status:</strong> {msg.data.status}</p>
                <p><strong>Assigned To:</strong> {msg.data.assignedTo}</p>
              </div>
            ) : (
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${msg.role === "user" ? "ml-auto bg-blue-100 text-blue-900" : "bg-gray-200 text-gray-800"}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            )}
          </div>
        ))}
      </div>

      {listening && (
        <div className="px-4 pb-1">
          <div className="flex gap-1 h-5 items-end">
            <div className="w-1 bg-blue-400 animate-wave h-full"></div>
            <div className="w-1 bg-purple-400 animate-wave2 h-[70%]"></div>
            <div className="w-1 bg-blue-400 animate-wave h-[90%]"></div>
            <div className="w-1 bg-purple-400 animate-wave2 h-[60%]"></div>
            <div className="w-1 bg-blue-400 animate-wave h-[80%]"></div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-300 flex gap-2 items-center bg-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full px-4 py-2 rounded-full bg-white text-gray-900 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleVoice}
          className={`rounded-full p-2 ${listening ? "bg-red-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          title="Voice input"
        >
          🎤
        </button>
      </div>
      {loading && <div className="text-xs text-gray-500 px-4 pb-2 animate-pulse">Thinking...</div>}
    </motion.div>
  );
};

export default AIChatBot;
