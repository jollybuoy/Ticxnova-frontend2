// src/pages/AllTickets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiLayers,
  FiEye,
} from "react-icons/fi";
import axios from "../api/axios";

const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/tickets"); // No hardcoded full URL!
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter((ticket) => {
    const matchSearch =
      ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchDept = departmentFilter ? ticket.department === departmentFilter : true;
    return matchSearch && matchStatus && matchDept;
  });

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📁 All Tickets</h1>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg w-full md:w-1/3">
          <FiSearch />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full px-2"
          />
        </div>

        <select
          className="bg-white/10 text-white p-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">🎯 Filter by Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          className="bg-white/10 text-white p-2 rounded-lg"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">🏢 Filter by Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white/10 p-5 rounded-xl shadow-md hover:shadow-lg transition border border-white/10"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">🎫 {ticket.title}</h2>
                <span className="text-sm px-3 py-1 rounded-full bg-blue-600 text-white capitalize">
                  {ticket.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-2">
                <span className="flex items-center gap-1">
                  <FiAlertCircle /> Priority: {ticket.priority}
                </span>
                <span className="flex items-center gap-1">
                  <FiLayers /> Department: {ticket.department}
                </span>
                <span className="flex items-center gap-1">
                  <FiUser /> Assigned To: {ticket.assignedTo || "Unassigned"}
                </span>
              </div>
              <button
                onClick={() => navigate(`/ticket/${ticket.id}`)}
                className="mt-2 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-white"
              >
                <FiEye /> Open Ticket
              </button>
            </div>
          ))
        ) : (
          <p className="text-white/70">No tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
