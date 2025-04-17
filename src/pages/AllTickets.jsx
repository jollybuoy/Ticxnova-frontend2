// src/pages/AllTickets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  FiSearch,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const priorityColor = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-400 text-black",
  Low: "bg-green-500 text-white",
};

const statusOptions = ["Open", "In Progress", "Completed", "Closed"];
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketId?.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter ? t.priority === priorityFilter : true;
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    const matchType = typeFilter ? t.ticketType === typeFilter : true;
    return matchSearch && matchPriority && matchStatus && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortIcon = (field) => {
    if (sortField !== field) return null;
    return sortAsc ? <FiChevronUp className="inline ml-1" /> : <FiChevronDown className="inline ml-1" />;
  };

  const uniqueTypes = [...new Set(tickets.map(t => t.ticketType).filter(Boolean))];

  return (
    <div className="p-6 text-gray-900 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📁 All Tickets</h1>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg text-white"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-gray-100 p-2 rounded-lg w-full md:w-1/3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none px-3 w-full text-gray-900"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg"
        >
          <option value="">⚡ Filter by Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg"
        >
          <option value="">📌 Filter by Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg"
        >
          <option value="">🎟️ Filter by Ticket Type</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={itemsPerPage}
          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
          className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg"
        >
          {PAGE_SIZE_OPTIONS.map(n => (
            <option key={n} value={n}>Show {n}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {paginated.map((ticket, index) => (
          <div
            key={ticket.id}
            onClick={() => navigate(`/ticket/${ticket.id}`)}
            className="cursor-pointer bg-white rounded-full shadow border px-6 py-4 flex flex-wrap items-center justify-between hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="text-lg font-extrabold font-mono text-indigo-700">{ticket.ticketId}</div>
              <div className="text-base font-semibold text-gray-800">{ticket.title}</div>
            </div>
            <div className="flex items-center gap-4 flex-wrap mt-2 md:mt-0">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityColor[ticket.priority] || "bg-gray-300"}`}>
                {ticket.priority}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                ticket.status === "Open"
                  ? "bg-blue-500 text-white"
                  : ticket.status === "In Progress"
                  ? "bg-yellow-500 text-black"
                  : "bg-green-500 text-white"
              }`}>
                {ticket.status}
              </span>
              <span className="text-sm text-gray-600">{ticket.ticketType || "-"}</span>
              <span className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</span>
              <span className="text-sm text-purple-600 font-medium">{ticket.assignedTo || "Unassigned"}</span>
            </div>
          </div>
        ))}

        {paginated.length === 0 && (
          <p className="text-center text-gray-500 p-6">No tickets found.</p>
        )}

        <div className="flex justify-end items-center mt-4 gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            <FiChevronLeft /> Prev
          </button>
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
