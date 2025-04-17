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
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
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
            </Route>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Floating AI Assistant Button */}
        {isAuthenticated && (
          <>
            <button
  className="fixed bottom-5 right-5 z-50"
  onClick={() => setShowAI(true)}
  aria-label="Open Ticxnova AI"
>
  <div className="relative w-20 h-20">
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center animate-spin-slow relative">
      <div className="absolute top-1 left-0 w-full text-center">
        <span className="text-white text-xs font-semibold drop-shadow-lg tracking-wide bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-bounce animate-pulse">
          Ticxnova AI
        </span>
      </div>
      <span className="text-3xl">🧠</span>
    </div>
  </div>
</button>

            <AIChatBot isOpen={showAI} onClose={() => setShowAI(false)} token={userToken} />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
