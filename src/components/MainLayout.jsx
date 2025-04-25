// src/components/MainLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/ticxnova-logo.png";
import AIChatBot from "./AIChatBot";
import { useMsal } from "@azure/msal-react";

const MainLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { instance } = useMsal(); // ✅ MSAL instance for Microsoft logout

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (!decoded.name) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setUserName(decoded.name || "User");
      } catch (err) {
        console.error("Token decode error:", err);
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    const loginMethod = localStorage.getItem("loginMethod");

    // Clear everything
    localStorage.removeItem("token");
    localStorage.removeItem("loginMethod");

    if (setAuth) setAuth(false);

    // Logout based on login type
    if (loginMethod === "microsoft") {
      instance.logoutRedirect(); // full redirect
    } else {
      window.location.href = "/"; // 🔥 full page reload to login
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-800 via-Emerald-100 to-cyan-100 text-orange">
     {/* Sidebar */}
<div className="group relative hover:w-72 w-16 transition-all duration-300 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-lg overflow-hidden flex flex-col items-center">
  <div className="absolute left-0 top-0 h-full w-72 p-5 group-hover:opacity-100 opacity-0 transition-opacity duration-300">

    <div className="flex items-center gap-2 mb-12">
      <img
        src={logo}
        alt="Ticxnova Logo"
        className="h-10 w-10 rounded-full shadow ring-2 ring-white/30"
      />
      <h2 className="text-2xl font-bold">TICXNOVA</h2>
    </div>

    <div className="flex items-center gap-3 mb-8 px-2">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`}
        alt="Avatar"
        className="h-8 w-8 rounded-full border border-white shadow"
      />
      <span className="text-sm text-orange-400 font-semibold" style={{ fontSize: "1rem" }}>
        Welcome, {userName}
      </span>
    </div>

    <ul className="space-y-4">
      <li onClick={() => navigate("/dashboard")} className="hover:text-blue-400 cursor-pointer">📊 Dashboard</li>
      <li onClick={() => navigate("/create-ticket")} className="hover:text-blue-400 cursor-pointer">➕ Create Ticket</li>
      <li onClick={() => navigate("/all-tickets")} className="hover:text-blue-400 cursor-pointer">📁 All Tickets</li>
      <li onClick={() => navigate("/users")} className="hover:text-blue-400 cursor-pointer">👥 Users</li>
      <li onClick={() => navigate("/knowledgebase")} className="hover:text-blue-400 cursor-pointer">📚 Knowledge Base</li>
      <li onClick={() => navigate("/reports")} className="hover:text-blue-400 cursor-pointer">📈 Reports</li>
      <li onClick={() => navigate("/notifications")} className="hover:text-blue-400 cursor-pointer">🔔 Notifications</li>
      <li onClick={() => navigate("/messages")} className="hover:text-blue-400 cursor-pointer">📨 Messages</li>
      <li onClick={() => navigate("/settings")} className="hover:text-blue-400 cursor-pointer">⚙️ Settings</li>
      <li onClick={() => navigate("/adminpanel")} className="hover:text-blue-400 cursor-pointer">🛠️ Admin Panel</li>
      <li onClick={() => navigate("/slatracker")} className="hover:text-blue-400 cursor-pointer">🎯 SLA Tracker</li>
      <li onClick={() => navigate("/assetmanagement")} className="hover:text-blue-400 cursor-pointer">📦 Asset Management</li>
      <li onClick={() => navigate("/emailtemplates")} className="hover:text-blue-400 cursor-pointer">📬 Email Templates</li>
    </ul>

    <button
      onClick={handleLogout}
      className="mt-10 w-full bg-gradient-to-r from-yellow-500 to-pink-600 px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-pink-700 transition duration-300"
    >
      🔓 Logout
    </button>
  </div>

 {/* Mini Icon Menu (Always Visible, hides on hover) */}
<div className="flex flex-col items-center gap-6 mt-8 transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
  <button onClick={() => navigate("/dashboard")} title="Dashboard">📊</button>
  <button onClick={() => navigate("/create-ticket")} title="Create Ticket">➕</button>
  <button onClick={() => navigate("/all-tickets")} title="All Tickets">📁</button>
  <button onClick={() => navigate("/users")} title="Users">👥</button>
  <button onClick={() => navigate("/knowledgebase")} title="Knowledge Base">📚</button>
  <button onClick={() => navigate("/reports")} title="Reports">📈</button>
  <button onClick={() => navigate("/notifications")} title="Notifications">🔔</button>
  <button onClick={() => navigate("/messages")} title="Messages">📨</button>
  <button onClick={() => navigate("/settings")} title="Settings">⚙️</button>
  <button onClick={() => navigate("/adminpanel")} title="Admin Panel">🛠️</button>
  <button onClick={() => navigate("/slatracker")} title="SLA Tracker">🎯</button>
  <button onClick={() => navigate("/assetmanagement")} title="Assets">📦</button>
  <button onClick={() => navigate("/emailtemplates")} title="Templates">📬</button>
</div>
</div>


      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto relative">
        <Outlet />
        <AIChatBot />
      </div>
    </div>
  );
};

export default MainLayout;
