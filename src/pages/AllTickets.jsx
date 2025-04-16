// src/pages/AllTickets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiTag,
  FiShield,
  FiHash,
  FiUser,
  FiClock,
  FiLayers,
  FiFilter
} from "react-icons/fi";

const typeColors = {
  "Incident": "from-red-500 to-pink-500",
  "Service Request": "from-blue-500 to-sky-500",
  "Change Request": "from-purple-500 to-indigo-500",
  "Problem": "from-orange-500 to-amber-500",
  "Task": "from-emerald-500 to-teal-500",
};

const priorityColor = {
  "High": "bg-red-500",
  "Medium": "bg-yellow-500",
  "Low": "bg-green-500",
};

const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter(t => {
    const matchSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketId?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter ? t.ticketType === typeFilter : true;
    const matchPriority = priorityFilter ? t.priority === priorityFilter : true;
    return matchSearch && matchType && matchPriority;
  });

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📁 All Tickets</h1>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-white/10 p-2 rounded-lg w-full md:w-1/3">
          <FiSearch className="text-white/70" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none px-3 w-full text-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white/10 text-white px-3 py-2 rounded-lg"
        >
          <option value="">🎯 Filter by Type</option>
          <option value="Incident">Incident</option>
          <option value="Service Request">Service Request</option>
          <option value="Change Request">Change Request</option>
          <option value="Problem">Problem</option>
          <option value="Task">Task</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-white/10 text-white px-3 py-2 rounded-lg"
        >
          <option value="">⚡ Filter by Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border-separate border-spacing-y-4">
          <thead>
            <tr className="text-left text-white/80">
              <th>🎫 Ticket ID</th>
              <th>📄 Title</th>
              <th>🏷️ Type</th>
              <th>⚡ Priority</th>
              <th>📌 Status</th>
              <th>👤 Assigned To</th>
              <th>🕒 Created</th>
              <th>🔍 View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <tr
                key={ticket.id}
                className={`rounded-xl bg-gradient-to-r ${typeColors[ticket.ticketType] || "from-slate-700 to-slate-800"} text-white shadow-lg`}
              >
                <td className="p-3 font-mono">{ticket.ticketId}</td>
                <td className="p-3 font-semibold">{ticket.title}</td>
                <td className="p-3">{ticket.ticketType || "—"}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityColor[ticket.priority] || "bg-gray-500"}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="p-3 capitalize">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    ticket.status === "Open"
                      ? "bg-blue-500"
                      : ticket.status === "In Progress"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-3">{ticket.assignedTo || "Unassigned"}</td>
                <td className="p-3">{new Date(ticket.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                    className="text-cyan-300 hover:text-white transition-all"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-white/50 p-6">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTickets;
