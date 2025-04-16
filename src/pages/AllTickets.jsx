// src/pages/AllTickets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiDownload,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const typeColors = {
  Incident: "from-red-100 to-red-200",
  "Service Request": "from-blue-100 to-blue-200",
  "Change Request": "from-purple-100 to-purple-200",
  Problem: "from-orange-100 to-orange-200",
  Task: "from-emerald-100 to-emerald-200",
};

const priorityColor = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const statusOptions = ["Open", "In Progress", "Completed", "Closed"];
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    const matchType = typeFilter ? t.ticketType === typeFilter : true;
    const matchPriority = priorityFilter ? t.priority === priorityFilter : true;
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    return matchSearch && matchType && matchPriority && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

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

  const exportCSV = () => {
    const header = ["Ticket ID", "Title", "Type", "Priority", "Status", "Assigned To", "Created"];
    const rows = sorted.map((t) => [
      t.ticketId,
      t.title,
      t.ticketType,
      t.priority,
      t.status,
      t.assignedTo || "Unassigned",
      new Date(t.createdAt).toLocaleString(),
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📁 All Tickets</h1>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-lime-500 to-green-600 px-4 py-2 rounded-lg"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            onClick={fetchTickets}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg animate-pulse"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-slate-800 p-2 rounded-lg w-full md:w-1/3">
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
          className="bg-slate-800 text-white px-3 py-2 rounded-lg"
        >
          <option value="">🎯 Filter by Type</option>
          {Object.keys(typeColors).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-800 text-white px-3 py-2 rounded-lg"
        >
          <option value="">⚡ Filter by Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 text-white px-3 py-2 rounded-lg"
        >
          <option value="">📌 Filter by Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="bg-slate-800 text-white px-3 py-2 rounded-lg"
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border-separate border-spacing-y-4">
          <thead>
            <tr className="text-left text-white/80">
              <th onClick={() => toggleSort("id")}># {sortIcon("id")}</th>
              <th onClick={() => toggleSort("ticketId")}>🎫 <strong>Ticket ID</strong> {sortIcon("ticketId")}</th>
              <th onClick={() => toggleSort("title")}>📄 <strong>Title</strong> {sortIcon("title")}</th>
              <th>🏷️ <strong>Type</strong></th>
              <th onClick={() => toggleSort("priority")}>⚡ <strong>Priority</strong> {sortIcon("priority")}</th>
              <th onClick={() => toggleSort("status")}>📌 <strong>Status</strong> {sortIcon("status")}</th>
              <th onClick={() => toggleSort("assignedTo")}>👤 <strong>Assigned To</strong> {sortIcon("assignedTo")}</th>
              <th onClick={() => toggleSort("createdAt")}>🕒 <strong>Created</strong> {sortIcon("createdAt")}</th>
              <th>🔍</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((ticket, index) => (
              <tr
                key={ticket.id}
                className={`rounded-xl bg-gradient-to-r ${typeColors[ticket.ticketType] || "from-slate-700 to-slate-800"} text-white shadow-lg`}
              >
                <td className="p-3 font-bold">{(page - 1) * pageSize + index + 1}</td>
                <td className="p-3 font-bold font-mono">{ticket.ticketId}</td>
                <td className="p-3 font-semibold">{ticket.title}</td>
                <td className="p-3 text-sm font-medium">{ticket.ticketType || "—"}</td>
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
            {paginated.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-white/50 p-6">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4 gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
          >
            <FiChevronLeft /> Prev
          </button>
          <span className="text-sm text-white/70">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
