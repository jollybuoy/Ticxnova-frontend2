import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiSend, FiSmile, FiPaperclip, FiPhone, FiVideo, FiMoreHorizontal, FiX, FiChevronDown } from "react-icons/fi";
import io from "socket.io-client";

const UserPresenceChat = ({ currentUser, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [frequentContacts, setFrequentContacts] = useState([]);
  const [isTyping, setIsTyping] = useState({});
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Emoji data
  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
    "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔"
  ];

  // Initialize socket connection
  useEffect(() => {
    if (isOpen && !socket) {
      const token = localStorage.getItem("token");
      if (token) {
        const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
          setConnectionStatus('connected');
          console.log('Connected to chat server');
        });

        newSocket.on('disconnect', () => {
          setConnectionStatus('disconnected');
          console.log('Disconnected from chat server');
        });

        newSocket.on('connect_error', (error) => {
          setConnectionStatus('error');
          console.error('Connection error:', error);
        });

        // Listen for real-time events
        newSocket.on('new_message', (messageData) => {
          setMessages(prev => ({
            ...prev,
            [messageData.senderId]: [...(prev[messageData.senderId] || []), {
              ...messageData,
              senderId: messageData.senderId,
              timestamp: new Date(messageData.timestamp)
            }]
          }));
        });

        newSocket.on('user_online', (userData) => {
          setOnlineUsers(prev => {
            const exists = prev.find(u => u.id === userData.userId);
            if (!exists) {
              return [...prev, {
                id: userData.userId,
                name: userData.name,
                email: userData.email,
                status: 'online',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3B82F6&color=fff`
              }];
            }
            return prev;
          });
        });

        newSocket.on('user_offline', (userData) => {
          setOnlineUsers(prev => prev.filter(u => u.id !== userData.userId));
        });

        newSocket.on('user_typing', (data) => {
          setIsTyping(prev => ({
            ...prev,
            [data.userId]: data.typing
          }));
        });

        setSocket(newSocket);
      }
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnectionStatus('disconnected');
      }
    };
  }, [isOpen]);

  // Fetch online users and chat data
  useEffect(() => {
    if (isOpen && connectionStatus === 'connected') {
      fetchOnlineUsers();
    }
  }, [isOpen, connectionStatus]);

  const fetchOnlineUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/users/online`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const users = await response.json();
        setOnlineUsers(users.filter(u => u.status === 'online'));
        setFrequentContacts(users.filter(u => u.isFrequent));
      } else {
        // Fallback to mock data if API is not available
        setOnlineUsers(mockUsers.filter(u => u.status === 'online'));
        setFrequentContacts(mockUsers.filter(u => u.isFrequent));
      }
    } catch (error) {
      console.warn('Failed to fetch online users, using mock data:', error);
      // Use mock data as fallback
      setOnlineUsers(mockUsers.filter(u => u.status === 'online'));
      setFrequentContacts(mockUsers.filter(u => u.isFrequent));
    }
  };

  // Mock users data as fallback
  const mockUsers = [
    {
      id: 1,
      name: "Sarah Williams",
      email: "sarah.williams@company.com",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=3B82F6&color=fff",
      status: "online",
      lastSeen: "now",
      department: "IT Support",
      role: "Senior Agent",
      isFrequent: true
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff",
      status: "online",
      lastSeen: "2 min ago",
      department: "Development",
      role: "Lead Developer",
      isFrequent: true
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@company.com",
      avatar: "https://ui-avatars.com/api/?name=Emma+Rodriguez&background=F59E0B&color=fff",
      status: "away",
      lastSeen: "15 min ago",
      department: "HR",
      role: "HR Manager",
      isFrequent: true
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=8B5CF6&color=fff",
      status: "online",
      lastSeen: "now",
      department: "Finance",
      role: "Financial Analyst",
      isFrequent: false
    }
  ];

  const fetchChatMessages = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const chatMessages = await response.json();
        setMessages(prev => ({
          ...prev,
          [userId]: chatMessages
        }));
      } else {
        // Use mock messages as fallback
        const mockMessages = [
          {
            id: 1,
            senderId: userId,
            text: "Hey! How's the new ticketing system working out?",
            timestamp: new Date(Date.now() - 300000),
            type: "text"
          },
          {
            id: 2,
            senderId: "me",
            text: "It's amazing! The AI features are really helpful 🚀",
            timestamp: new Date(Date.now() - 240000),
            type: "text"
          }
        ];
        setMessages(prev => ({
          ...prev,
          [userId]: mockMessages
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch chat messages, using mock data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  const filteredUsers = [...onlineUsers, ...mockUsers].filter((user, index, self) =>
    index === self.findIndex(u => u.id === user.id) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (b.status === "online" && a.status !== "online") return 1;
    if (a.isFrequent && !b.isFrequent) return -1;
    if (b.isFrequent && !a.isFrequent) return 1;
    return a.name.localeCompare(b.name);
  });

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      senderId: "me",
      text: message,
      timestamp: new Date(),
      type: "text"
    };

    // Optimistically update UI
    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    }));

    setMessage("");

    try {
      if (socket && connectionStatus === 'connected') {
        // Send via socket for real-time delivery
        socket.emit('send_message', {
          receiverId: selectedUser.id,
          message: newMessage.text,
          type: 'text'
        });
      } else {
        // Fallback to REST API
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            receiverId: selectedUser.id,
            message: newMessage.text,
            type: 'text'
          })
        });
      }
    } catch (error) {
      console.warn('Failed to send message:', error);
      // Simulate response for demo
      setTimeout(() => {
        const responses = [
          "Thanks for reaching out! 👍",
          "I'll look into that right away.",
          "Great question! Let me check on that.",
          "Absolutely! I can help with that."
        ];
        
        const responseMessage = {
          id: Date.now() + 1,
          senderId: selectedUser.id,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: "text"
        };

        setMessages(prev => ({
          ...prev,
          [selectedUser.id]: [...(prev[selectedUser.id] || []), responseMessage]
        }));
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    chatInputRef.current?.focus();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online": return "Online";
      case "away": return "Away";
      case "busy": return "Busy";
      default: return "Offline";
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchChatMessages(user.id);
    if (socket) {
      socket.emit('join_chat', { otherUserId: user.id });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-20 left-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">Team Chat</h3>
              <p className="text-xs text-blue-100">
                {onlineUsers.length} online • {connectionStatus}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className={`${selectedUser ? 'w-0 opacity-0' : 'w-full opacity-100'} transition-all duration-300 bg-gray-50 border-r border-gray-200 flex flex-col`}>
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Connection Status */}
          {connectionStatus !== 'connected' && (
            <div className="p-2 bg-yellow-50 border-b border-yellow-200">
              <p className="text-xs text-yellow-700 text-center">
                {connectionStatus === 'error' ? '⚠️ Connection failed - using demo mode' : '🔄 Connecting...'}
              </p>
            </div>
          )}

          {/* Online Users Section */}
          {onlineUsers.length > 0 && (
            <div className="p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online Now ({onlineUsers.length})
              </h4>
              <div className="space-y-1">
                {onlineUsers.slice(0, 3).map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUserSelect(user)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-all duration-200 group"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.department}</p>
                    </div>
                    {messages[user.id] && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Users */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                All Users
              </h4>
              <div className="space-y-1">
                {sortedUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUserSelect(user)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-all duration-200 group"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                      {user.isFrequent && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs">⭐</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                          {user.name}
                        </p>
                        {user.isFrequent && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                            Frequent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.role} • {user.department}</p>
                      <p className="text-xs text-gray-400">
                        {getStatusText(user.status)} • {user.lastSeen}
                      </p>
                    </div>
                    {messages[user.id] && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 flex flex-col bg-white"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedUser(null)}
                      className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiChevronDown className="w-4 h-4 rotate-90" />
                    </motion.button>
                    <div className="relative">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(selectedUser.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedUser.name}</h4>
                      <p className="text-xs text-gray-500">
                        {getStatusText(selectedUser.status)} • {selectedUser.lastSeen}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiPhone className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiVideo className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[selectedUser.id]?.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${msg.senderId === "me" ? "order-2" : "order-1"}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.senderId === "me"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.senderId !== "me" && (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-8 h-8 rounded-full order-1 mr-2 mt-auto"
                      />
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping[selectedUser.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 border-t border-gray-200 bg-gray-50"
                  >
                    <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                      {emojis.map((emoji, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addEmoji(emoji)}
                          className="text-lg hover:bg-gray-200 rounded-lg p-1 transition-colors"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={chatInputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message ${selectedUser.name}...`}
                      className="w-full px-4 py-3 pr-20 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiSmile className="w-4 h-4 text-gray-500" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiPaperclip className="w-4 h-4 text-gray-500" />
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FiSend className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UserPresenceChat;