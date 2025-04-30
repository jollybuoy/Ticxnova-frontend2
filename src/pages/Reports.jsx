import React, { useState } from "react";
import axios from "axios";
import Select, { components } from "react-select";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { FaDownload, FaSearch, FaTrash, FaFilter } from "react-icons/fa";
import logo from "../assets/ticxnova-logo.png";

// Dropdown data
const OPTIONS = {
  priority: ["P1", "P2", "P3", "P4"],
  department: ["IT", "HR", "Finance", "Facilities"],
  type: ["Incident", "Service Request", "Change Request", "Problem", "Task"],
  status: ["Open", "Closed", "In Progress", "Resolved"]
};
const toOptions = (arr) => arr.map((v) => ({ value: v, label: v }));

// Styling & checkbox
const customStyles = {
  option: (base, { isSelected }) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
    backgroundColor: isSelected ? "#e0f2fe" : "#fff",
    color: "#000",
    padding: "8px 12px",
  }),
  control: (base) => ({
    ...base,
    minHeight: 42,
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    fontSize: "0.875rem"
  }),
  multiValue: () => ({ display: "none" }),
  menu: (base) => ({ ...base, zIndex: 999 })
};
const ValueContainer = ({ children, ...props }) => (
  <components.ValueContainer {...props}>{children[1]}</components.ValueContainer>
);
const CheckboxOption = (props) => {
  const { isSelected, label, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer">
      <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 border-gray-400 rounded mr-2" />
      <label className="text-sm">{label}</label>
    </div>
  );
};

const Reports = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priority: toOptions(OPTIONS.priority),
    department: toOptions(OPTIONS.department),
    type: toOptions(OPTIONS.type),
    status: toOptions(OPTIONS.status),
  });

  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const handleChange = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    ["priority", "department", "type", "status"].forEach(key => {
      if (filters[key]?.length) {
        params.append(key, filters[key].map(o => o.value).join(","));
      }
    });
    return params.toString();
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/tickets?${buildQuery()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllTickets(res.data);
      setTickets(res.data.slice(0, 50));
      setDrawerOpen(false); // close drawer
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      priority: toOptions(OPTIONS.priority),
      department: toOptions(OPTIONS.department),
      type: toOptions(OPTIONS.type),
      status: toOptions(OPTIONS.status),
    });
    setTickets([]);
    setAllTickets([]);
    setDrawerOpen(false);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(allTickets);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Ticxnova_Tickets_Report.csv");
  };

  return (
    <div className="relative p-6 bg-gradient-to-br from-slate-100 to-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Ticxnova Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-3xl font-bold text-gray-800">📄 Ticket Reports</h1>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaFilter /> Filters
        </button>
      </header>

      {/* Export Bar */}
      {allTickets.length > 0 && (
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <span>Showing {tickets.length} of {allTickets.length} tickets</span>
          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      )}

      {/* Ticket Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ticketId", "type", "priority", "status", "assignedTo", "department",
                "createdAt", "resolvedAt", "createdBy", "resolvedBy"
              ].map((col) => (
                <th key={col} className="text-left p-2 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
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

      {/* 🔽 Filter Drawer */}
      {drawerOpen && (
        <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">🔍 Filter Tickets</h2>

          <label className="block mb-2 text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="mb-4 w-full px-3 py-2 rounded bg-gray-100 text-sm"
            value={filters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />

          <label className="block mb-2 text-sm font-medium">End Date</label>
          <input
            type="date"
            className="mb-4 w-full px-3 py-2 rounded bg-gray-100 text-sm"
            value={filters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />

          {["priority", "department", "type", "status"].map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 text-sm font-medium capitalize">{key}</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={toOptions(OPTIONS[key])}
                value={filters[key]}
                onChange={(val) => handleChange(key, val)}
                placeholder={`Select ${key}`}
                styles={customStyles}
                components={{ Option: CheckboxOption, ValueContainer }}
              />
            </div>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              onClick={fetchTickets}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
            >
              <FaSearch /> Apply
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-600 py-2 px-4 rounded-md flex items-center gap-2"
            >
              <FaTrash /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
