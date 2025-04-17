// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import {
  FiBell,
  FiEdit,
  FiUserPlus,
  FiCheckCircle,
  FiAlertTriangle,
  FiMessageSquare,
  FiClock,
  FiTrash2
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

const socket = io("https://your-backend-domain.com"); // Replace with your backend URL

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Mock initial load from backend
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));

    // WebSocket: Receive new notifications
    socket.on("new-notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      toast.success(notif.message);
    });

    return () => socket.disconnect();
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    toast("📬 All notifications marked as read.");
  };

  const clearAll = () => {
    setNotifications([]);
    toast("🗑 Notifications cleared.");
  };

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiBell className="text-indigo-600" /> Notifications
        </h1>
        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200"
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200"
          >
            <FiTrash2 className="inline mr-1" /> Clear All
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            filter === "unread"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-4 rounded-xl shadow border ${
              n.isRead ? "bg-white" : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <div className="text-xl mt-1">{getIcon(n.type)}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{n.message}</p>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <FiClock /> {n.time}
              </div>
            </div>
            {!n.isRead && (
              <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">New</span>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No notifications to display.
          </div>
        )}
      </div>
    </div>
  );
};

const getIcon = (type) => {
  switch (type) {
    case "assignment": return <FiUserPlus className="text-green-600" />;
    case "status": return <FiEdit className="text-yellow-500" />;
    case "note": return <FiMessageSquare className="text-blue-500" />;
    case "broadcast": return <FiAlertTriangle className="text-red-600" />;
    default: return <FiCheckCircle className="text-gray-400" />;
  }
};

export default Notifications;
