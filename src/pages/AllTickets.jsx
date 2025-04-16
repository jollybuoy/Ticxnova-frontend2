import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiHash,
  FiAlertCircle,
  FiUser,
  FiClock,
  FiLayers,
  FiSettings,
} from "react-icons/fi";

const priorityColors = {
  High: "bg-red-600",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const typeGradients = {
  Incident: "from-red-400 to-red-600",
  "Service Request": "from-blue-400 to-blue-600",
  "Change Request": "from-yellow-400 to-yellow-600",
  Problem: "from-purple-400 to-purple-600",
  Task: "from-sky-400 to-sky-600",
};

const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    return (
      (t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId?.toLowerCase().includes(search.toLowerCase())) &&
      (priorityFilter ? t.priority === priorityFilter : true) &&
      (typeFilter ? t.ticketType === typeFilter : true)
    );
  });

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <FiSettings /> All Tickets
        </h1>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700 px-4 py-2 rounded-lg shadow-lg"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg w-full md:w-1/3">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full px-2"
          />
        </div>

        <select
          className="bg-white/10 text-white p-2 rounded-lg"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">🎫 Filter by Type</option>
          <option value="Incident">Incident</option>
          <option value="Service Request">Service Request</option>
          <option value="Change Request">Change Request</option>
          <option value="Problem">Problem</option>
          <option value="Task">Task</option>
        </select>

        <select
          className="bg-white/10 text-white p-2 rounded-lg"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">⚡ Filter by Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {filtered.length > 0 ? (
          filtered.map((ticket) => {
            const bg = typeGradients[ticket.ticketType] || "from-gray-600 to-gray-800";
            const priorityClass = priorityColors[ticket.priority] || "bg-gray-500";

            return (
              <div
                key={ticket.id}
                className={`p-6 rounded-2xl bg-gradient-to-r ${bg} shadow-xl border border-white/10 hover:scale-[1.01] transition-all`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FiHash /> {ticket.ticketId || `TCK-${ticket.id}`}
                    </h2>
                    <p className="text-lg font-medium text-white/90 mt-1">
                      {ticket.title}
                    </p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-white/20 text-white">
                    {ticket.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <FiAlertCircle />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${priorityClass} text-white`}
                    >
                      {ticket.priority}
                    </span>
                  </span>

                  <span className="flex items-center gap-1">
                    <FiLayers /> {ticket.ticketType || "-"}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiUser /> {ticket.assignedTo || "Unassigned"}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiClock /> {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                  className="mt-4 flex items-center gap-2 text-sm text-cyan-100 hover:text-white"
                >
                  <FiEye /> Open Ticket
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-white/70">No matching tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
