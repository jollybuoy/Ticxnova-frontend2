import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import Select from "react-select";
import { saveAs } from "file-saver";

import { FaDownload, FaSearch } from "react-icons/fa";
import logo from "../assets/ticxnova-logo.png";

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priority: [],
    department: [],
    type: [],
    status: []
  });

  const [tickets, setTickets] = useState([]);
  const [allResults, setAllResults] = useState([]);

  const limit = 50;

  const multiOptions = {
    priority: ["P1", "P2", "P3", "P4"],
    department: ["IT", "HR", "Finance", "Facilities"],
    type: ["Incident", "Service Request", "Change Request", "Problem", "Task"],
    status: ["Open", "Closed", "In Progress", "Resolved"]
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.priority.length)
      params.append("priority", filters.priority.map((x) => x.value).join(","));
    if (filters.department.length)
      params.append("department", filters.department.map((x) => x.value).join(","));
    if (filters.type.length)
      params.append("type", filters.type.map((x) => x.value).join(","));
    if (filters.status.length)
      params.append("status", filters.status.map((x) => x.value).join(","));

    return params.toString();
  };

  const fetchFilteredTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = buildQueryParams();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reports/tickets?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTickets(response.data.slice(0, limit));
      setAllResults(response.data);
    } catch (err) {
      console.error("Failed to fetch filtered tickets:", err);
    }
  };

  const exportAll = async () => {
    const csv = Papa.unparse(allResults);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Filtered_Tickets_Report.csv");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen">
      <header className="flex items-center gap-3 mb-6">
        <img src={logo} alt="Ticxnova Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">📄 Advanced Ticket Reports</h1>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <input
          type="date"
          className="px-3 py-2 rounded bg-gray-100 text-sm"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <input
          type="date"
          className="px-3 py-2 rounded bg-gray-100 text-sm"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <Select
          options={multiOptions.priority.map((v) => ({ value: v, label: v }))}
          isMulti
          placeholder="Priority"
          onChange={(value) => handleFilterChange("priority", value)}
        />
        <Select
          options={multiOptions.department.map((v) => ({ value: v, label: v }))}
          isMulti
          placeholder="Department"
          onChange={(value) => handleFilterChange("department", value)}
        />
        <Select
          options={multiOptions.type.map((v) => ({ value: v, label: v }))}
          isMulti
          placeholder="Type"
          onChange={(value) => handleFilterChange("type", value)}
        />
        <Select
          options={multiOptions.status.map((v) => ({ value: v, label: v }))}
          isMulti
          placeholder="Status"
          onChange={(value) => handleFilterChange("status", value)}
        />
        <button
          onClick={fetchFilteredTickets}
          className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaSearch /> Apply Filters
        </button>
      </div>

      {/* Export */}
      {allResults.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={exportAll}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaDownload /> Download Full Report
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ticketId",
                "type",
                "priority",
                "status",
                "assignedTo",
                "department",
                "createdAt",
                "resolvedAt",
                "createdBy",
                "resolvedBy"
              ].map((col) => (
                <th key={col} className="text-left p-2 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">{ticket.ticketId}</td>
                  <td className="p-2 border">{ticket.type}</td>
                  <td className="p-2 border">{ticket.priority}</td>
                  <td className="p-2 border">{ticket.status}</td>
                  <td className="p-2 border">{ticket.assignedTo}</td>
                  <td className="p-2 border">{ticket.department}</td>
                  <td className="p-2 border">{ticket.createdAt}</td>
                  <td className="p-2 border">{ticket.resolvedAt || "-"}</td>
                  <td className="p-2 border">{ticket.createdBy}</td>
                  <td className="p-2 border">{ticket.resolvedBy || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No tickets to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
