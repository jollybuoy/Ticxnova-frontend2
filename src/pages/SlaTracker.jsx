// src/pages/SlaTracker.jsx
import React, { useEffect, useState } from "react";
import { FiClock, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const dummyTickets = [
  {
    id: "INC-1024",
    title: "Reset VPN Access",
    assignedTo: "john.doe@contoso.com",
    priority: "High",
    status: "In Progress",
    slaHours: 4,
    elapsedMinutes: 310, // 5h 10m
  },
  {
    id: "SR-1007",
    title: "Install Zoom for remote team",
    assignedTo: "jane.smith@contoso.com",
    priority: "Medium",
    status: "Open",
    slaHours: 12,
    elapsedMinutes: 180, // 3h
  }
];

const getSlaStatus = (elapsed, target) => {
  const percent = (elapsed / (target * 60)) * 100;
  if (percent >= 100) return "bg-red-600";
  if (percent >= 75) return "bg-orange-500";
  if (percent >= 50) return "bg-yellow-400";
  return "bg-green-500";
};

const formatTime = (minutes) => {
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  return `${d ? d + "d " : ""}${h ? h + "h " : ""}${m}m`;
};

const SlaTracker = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTickets(dummyTickets);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">🎯 SLA Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => {
          const slaMinutes = ticket.slaHours * 60;
          const used = ticket.elapsedMinutes;
          const left = slaMinutes - used;
          const percentUsed = Math.min((used / slaMinutes) * 100, 100);
          const barColor = getSlaStatus(used, ticket.slaHours);

          return (
            <div
              key={ticket.id}
              className="bg-white rounded-xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-slate-700">🎫 {ticket.id}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${barColor}`}
                >
                  {used >= slaMinutes ? "Overdue" : "In SLA"}
                </span>
              </div>
              <p className="text-slate-600 mb-3 text-sm font-medium">{ticket.title}</p>
              <div className="text-sm text-slate-500 mb-2">
                SLA Target: {ticket.slaHours}h | Elapsed: {formatTime(used)}
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor}`}
                  style={{ width: `${percentUsed}%` }}
                ></div>
              </div>
              <div className="mt-2 text-right text-xs text-slate-500">
                {left <= 0 ? (
                  <span className="text-red-600">⏱ Overdue by {formatTime(Math.abs(left))}</span>
                ) : (
                  <span className="text-green-600">⏳ {formatTime(left)} left</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlaTracker;
