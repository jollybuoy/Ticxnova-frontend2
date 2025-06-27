import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      { 
        role: "bot", 
        text: "👋 Welcome to <b>Ticxnova AI</b>. I'm your intelligent assistant powered by advanced AI. How can I help you today?",
        timestamp: new Date().toLocaleTimeString()
      }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { text: "🔍 Show my open tickets", icon: "🎫", gradient: "from-blue-500 to-cyan-500" },
    { text: "➕ Create a new ticket", icon: "✨", gradient: "from-green-500 to-emerald-500" },
    { text: "📈 SLA compliance report", icon: "📊", gradient: "from-purple-500 to-pink-500" },
    { text: "✅ Last 5 closed tickets", icon: "🎯", gradient: "from-orange-500 to-red-500" },
    { text: "👥 Show team performance", icon: "🏆", gradient: "from-indigo-500 to-purple-500" },
    { text: "🔧 System status check", icon: "⚡", gradient: "from-yellow-500 to-orange-500" }
  ];

  useEffect(() => {
    localStorage.setItem("ticxbot-history", JSON.stringify(messages));
    scrollToBottom();
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVoice = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (msg) => {
    const textToSend = msg || input;
    if (!textToSend.trim()) return;
    
    const newMessages = [...messages, { 
      role: "user", 
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

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

      // Simulate typing delay for more natural feel
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = [{ 
          role: "bot", 
          text: reply,
          timestamp: new Date().toLocaleTimeString()
        }];
        if (previewCard) {
          botResponse.push({ role: "preview", data: previewCard });
        }
        setMessages([...newMessages, ...botResponse]);
      }, 1500);

    } catch (err) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages([...newMessages, { 
          role: "bot", 
          text: "⚠️ I'm having trouble connecting to my servers. Please try again in a moment.",
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("ticxbot-history");
    setMessages([{ 
      role: "bot", 
      text: "🧠 Chat cleared. I'm ready to help you with anything!",
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-[480px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50 border-l border-slate-700/50 flex flex-col overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
        </div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden"
            >
              {/* Inner rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-white/30 rounded-full"
              />
              <span className="text-2xl relative z-10">🧠</span>
              
              {/* Floating particles */}
              <motion.div
                animate={{ 
                  y: [-2, -8, -2],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1 left-2 w-1 h-1 bg-cyan-300 rounded-full"
              />
              <motion.div
                animate={{ 
                  y: [-3, -6, -3],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-2 right-3 w-1 h-1 bg-pink-300 rounded-full"
              />
            </motion.div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ticxnova AI
            </h2>
            <p className="text-xs text-gray-400">Advanced AI Assistant</p>
            <div className="flex items-center gap-2 mt-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-xs text-green-400">Online • {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose} 
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
        >
          <XIcon />
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 p-4 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Quick Actions</h3>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearHistory} 
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
          >
            Clear Chat
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 text-xs bg-gradient-to-r ${action.gradient} rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium`}
              onClick={() => sendMessage(action.text)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{action.icon}</span>
                <span className="text-left leading-tight">{action.text.replace(/^[🔍➕📈✅👥🔧]\s/, '')}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === "preview" ? (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="border border-slate-600 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-sm shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📌</span>
                    <p className="font-semibold text-cyan-400">Ticket Preview</p>
                  </div>
                  <div className="space-y-1 text-gray-300">
                    <p><strong className="text-white">ID:</strong> {msg.data.id}</p>
                    <p><strong className="text-white">Title:</strong> {msg.data.title}</p>
                    <p><strong className="text-white">Status:</strong> {msg.data.status}</p>
                    <p><strong className="text-white">Assigned To:</strong> {msg.data.assignedTo}</p>
                  </div>
                </motion.div>
              ) : (
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      msg.role === "user" 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-4" 
                        : "bg-slate-800/70 backdrop-blur-sm text-gray-100 border border-slate-600/50 mr-4"
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    {msg.timestamp && (
                      <div className={`text-xs mt-2 opacity-70 ${msg.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                        {msg.timestamp}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-600/50 rounded-2xl px-4 py-3 mr-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-pink-400 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Listening Indicator */}
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center"
            >
              <div className="bg-red-500/20 border border-red-500/50 rounded-2xl px-6 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🎤
                  </motion.div>
                  <div>
                    <p className="text-red-300 font-semibold">Listening...</p>
                    <p className="text-xs text-red-400">Speak now</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16, 4] }}
                        transition={{ 
                          duration: 0.5, 
                          repeat: Infinity, 
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                        className="w-1 bg-red-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your tickets, reports, or system..."
              className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-700/50 backdrop-blur-sm text-white placeholder-gray-400 outline-none border border-slate-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVoice}
            className={`p-3 rounded-2xl transition-all duration-200 shadow-lg ${
              listening 
                ? "bg-red-500 animate-pulse" 
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl"
            } text-white`}
            title="Voice input"
          >
            🎤
          </motion.button>
        </div>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 mt-2 flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full"
            />
            Processing your request...
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIChatBot;