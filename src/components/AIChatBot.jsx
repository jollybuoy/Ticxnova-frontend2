// src/components/AIChatBot.jsx
import React, { useState } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm TicxBot, your assistant. Ask me anything about tickets, SLAs, or features." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY` // Replace securely
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful IT ticketing assistant for Ticxnova." },
            ...messages.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: input }
          ]
        })
      });
      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || "🤖 Sorry, something went wrong.";
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "⚠️ Failed to connect to AI service." }]);
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* Floating Button */}
      <div
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg cursor-pointer animate-bounce"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with TicxBot"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white text-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white p-3 font-semibold text-center">🤖 TicxBot Assistant</div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === "bot" ? "bg-blue-100 text-left" : "bg-green-100 ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="text-blue-400 italic">TicxBot is typing...</div>}
          </div>

          <div className="p-2 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              className="flex-1 text-sm px-3 py-1 border rounded-lg focus:outline-none"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              title="Send"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
