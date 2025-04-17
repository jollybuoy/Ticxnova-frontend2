// ✅ Updated MainLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/ticxnova-logo.png";
import AIChatBot from "./AIChatBot";

const MainLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("🔍 Decoded JWT:", decoded);
      
      // ✅ If no name in token, force logout
      if (!decoded.name) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      setUserName(decoded.name || "User");
    } catch (err) {
      console.error("Error decoding token:", err);
      setUserName("User");
    }
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setAuth) setAuth(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-900 via-cyan-800 to-indigo-900 text-orange">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-12">
          <img
            src={logo}
            alt="Ticxnova Logo"
            className="h-10 w-10 rounded-full shadow ring-2 ring-white/30"
          />
          <h2 className="text-2xl font-bold">Ticxnova</h2>
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
          <li onClick={() => navigate("/dashboard")} className="hover:text-blue-400 cursor-pointer">
            📊 Dashboard
          </li>
          <li onClick={() => navigate("/create-ticket")} className="hover:text-blue-400 cursor-pointer">
            ➕ Create Ticket
          </li>
          <li onClick={() => navigate("/all-tickets")} className="hover:text-blue-400 cursor-pointer">
            📁 All Tickets
          </li>
          <li className="hover:text-blue-400 cursor-pointer">👥 Users</li>
          <li className="hover:text-blue-400 cursor-pointer">📚 Knowledge Base</li>
<li onClick={() => navigate("/reports")} className="hover:text-blue-400 cursor-pointer">
  📈 Reports
</li>
          <li className="hover:text-blue-400 cursor-pointer">🔔 Notifications</li>
          <li className="hover:text-blue-400 cursor-pointer">📨 Messages</li>
          <li className="hover:text-blue-400 cursor-pointer">⚙️ Settings</li>
          <li className="hover:text-blue-400 cursor-pointer">🛠️ Admin Panel</li>
          <li className="hover:text-blue-400 cursor-pointer">🧑‍💼 Profile Page</li>
          <li className="hover:text-blue-400 cursor-pointer">🎯 SLA Tracker</li>
          <li className="hover:text-blue-400 cursor-pointer">📦 Asset Management</li>
          <li className="hover:text-blue-400 cursor-pointer">🔐 Role & Permission Settings</li>
          <li className="hover:text-blue-400 cursor-pointer">📬 Email Templates</li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-gradient-to-r from-yellow-500 to-pink-600 px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-pink-700 transition duration-300"
        >
          🔓 Logout
        </button>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6 overflow-auto relative">
        <Outlet />
        <AIChatBot />
      </div>
    </div>
  );
};

export default MainLayout;
