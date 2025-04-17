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
const [showAI, setShowAI] = useState(false);

<Button onClick={() => setShowAI(true)}>Open AI Assistant</Button>
<AIChatBot isOpen={showAI} onClose={() => setShowAI(false)} token={userToken} />


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 🆕 loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false); // ✅ done checking token
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
      <Routes>
        {/* Public Route - Login */}
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

        {/* Protected Routes with Layout */}
        {isAuthenticated && (
          <Route element={<MainLayout setAuth={setIsAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/all-tickets" element={<AllTickets />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
          </Route>
        )}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
