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
              onClick={() => setShowAI(true)}
              className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-40 hover:bg-blue-700 transition"
            >
              🤖 AI Assistant
            </button>
            <AIChatBot isOpen={showAI} onClose={() => setShowAI(false)} token={userToken} />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
