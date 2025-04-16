// src/components/MainLayout.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ticxnova-logo.png";

const navItems = [
  { label: "Dashboard", icon: "📊", route: "/dashboard" },
  { label: "Create Ticket", icon: "➕", route: "/create-ticket" },
  { label: "All Tickets", icon: "📁", route: "/all-tickets" },
 # { label: "Users", icon: "👥" },
  { label: "Knowledge Base", icon: "📚" },
  { label: "Reports", icon: "📈" },
  { label: "Notifications", icon: "🔔" },
 # { label: "Messages", icon: "📨" },
  { label: "Settings", icon: "⚙️" },
  { label: "Admin Panel", icon: "🛠️" },
  { label: "Profile Page", icon: "🧑‍💼" },
  { label: "SLA Tracker", icon: "🎯" },
  { label: "Asset Management", icon: "📦" },
  { label: "Role & Permission Settings", icon: "🔐" },
  # { label: "Email Templates", icon: "📬" },
];

const MainLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const isActive = (route) => pathname.startsWith(route);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (setAuth) setAuth(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-900 via-cyan-800 to-indigo-900 text-orange">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 p-5 text-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <img
              src={logo}
              alt="Ticxnova Logo"
              className="h-10 w-10 rounded-full shadow ring-2 ring-white/30"
            />
            <h2 className="text-2xl font-bold">Ticxnova</h2>
          </div>

          <ul className="space-y-4">
            {navItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => item.route && navigate(item.route)}
                className={`cursor-pointer px-2 py-1 rounded transition-all duration-200 ${
                  isActive(item.route) ? "bg-slate-700 text-blue-400 font-bold" : "hover:text-blue-400"
                }`}
                title={item.label}
              >
                {item.icon} {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {user?.email && (
            <div className="text-sm mb-4 text-white/70 flex items-center gap-2">
              <span className="text-green-400 text-lg">👤</span>
              <span>{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-yellow-500 to-pink-600 px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-pink-700 transition duration-300"
          >
            🔓 Logout
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
