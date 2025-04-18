// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import AllTickets from "./pages/AllTickets";
import MainLayout from "./components/MainLayout";
import TicketDetails from "./pages/TicketDetails";
import AIChatBot from './components/AIChatBot';
import Reports from "./pages/Reports";
import KnowledgeBase from "./pages/KnowledgeBase";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Messages from "./pages/Messages";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);

  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setAuth={setIsAuthenticated} />
              )
            }
          />
          {isAuthenticated && (
            <Route element={<MainLayout setAuth={setIsAuthenticated} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/all-tickets" element={<AllTickets />} />
              <Route path="/ticket/:id" element={<TicketDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/KnowledgeBase" element={<KnowledgeBase />} />
<Route path="/Notifications" element={<Notifications />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/Messages" element={<Messages />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* ✅ Ticxnova AI Bot Button */}
        <button
          className="fixed bottom-5 right-5 z-50"
          onClick={() => setShowAI(true)}
          aria-label="Open Ticxnova AI"
        >
          <div className="relative w-28 h-28 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 opacity-40 blur-lg animate-pulse" />
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-700 rounded-full shadow-2xl flex items-center justify-center animate-spin-slow relative z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white text-xl">
                🤖
              </div>
              <div className="absolute top-2 left-0 w-full text-center">
                <span className="text-white text-sm font-semibold drop-shadow-lg tracking-wide bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-bounce">
                  Ticxnova AI
                </span>
              </div>
              <span className="text-4xl">🧠</span>
            </div>
          </div>
        </button>

        {/* ✅ AI Assistant Panel */}
        <AIChatBot isOpen={showAI} onClose={() => setShowAI(false)} token={userToken} />
      </div>
    </Router>
  );
}

export default App;

