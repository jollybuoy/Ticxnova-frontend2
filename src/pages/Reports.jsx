import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { components } from "react-select";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { FaDownload, FaSearch, FaTrash } from "react-icons/fa";
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

  const multiOptions = {
    priority: ["P1", "P2", "P3", "P4"],
    department: ["IT", "HR", "Finance", "Facilities"],
    type: ["Incident", "Service Request", "Change Request", "Problem", "Task"],
    status: ["Open", "Closed", "In Progress", "Resolved"]
  };

  const toSelectOptions = (list) => list.map((v) => ({ value: v, label: v }));

  // Checkbox-style dropdown
  const customStyles = {
    option: (styles, { isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "#e0f2fe" : "#fff",
      color: "#000",
      fontSize: "0.875rem",
      padding: "0.5rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem"
    }),
    menu: (styles) => ({
      ...styles,
      zIndex: 999,
      fontSize: "0.875rem"
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
      minHeight: "44px",
      fontSize: "0.875rem"
    }),
    multiValue: () => ({ display: "none" }) // Hides inside the input box
  };

  const CustomValueContainer = ({ children, ...props }) => (
    <components.ValueContainer {...props}>{children[1]}</components.ValueContainer>
  );

  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer">
        <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 border-gray-300 rounded" />
        <label className="text-sm">{data.label}</label>
      </div>
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      priority: [],
      department: [],
      type: [],
      status: []
    });
    setTickets([]);
    setAllResults([]);
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
      setTickets(response.data.slice(0, 50));
      setAllResults(response.data);
    } catch (err) {
      console.error("❌ Report fetch error:", err);
    }
  };

  const exportAll = () => {
    const csv = Papa.unparse(allResults);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Filtered_Tickets_Report.csv");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen">
      <header className="flex items-center gap-3 mb-6">
        <img src={logo} alt="Ticxnova Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">📄 Ticket Reports</h1>
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
          isMulti
          closeMenuOnSelect={false}
          options={toSelectOptions(multiOptions.priority)}
          value={filters.priority.length ? filters.priority : toSelectOptions(multiOptions.priority)}
          onChange={(value) => handleFilterChange("priority", value)}
          placeholder="Priority"
          styles={customStyles}
          components={{ Option: CustomOption, ValueContainer: CustomValueContainer }}
        />

        <Select
          isMulti
          closeMenuOnSelect={false}
          options={toSelectOptions(multiOptions.department)}
          value={filters.department.length ? filters.department : toSelectOptions(multiOptions.department)}
          onChange={(value) => handleFilterChange("department", value)}
          placeholder="Department"
          styles={customStyles}
          components={{ Option: CustomOption, ValueContainer: CustomValueContainer }}
        />

        <Select
          isMulti
          closeMenuOnSelect={false}
          options={toSelectOptions(multiOptions.type)}
          value={filters.type.length ? filters.type : toSelectOptions(multiOptions.type)}
          onChange={(value) => handleFilterChange("type", value)}
          placeholder="Type"
          styles={customStyles}
          components={{ Option: CustomOption, ValueContainer: CustomValueContainer }}
        />

        <Select
          isMulti
          closeMenuOnSelect={false}
          options={toSelectOptions(multiOptions.status)}
          value={filters.status.length ? filters.status : toSelectOptions(multiOptions.status)}
          onChange={(value) => handleFilterChange("status", value)}
          placeholder="Status"
          styles={customStyles}
          components={{ Option: CustomOption, ValueContainer: CustomValueContainer }}
        />

        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center gap-3">
          <button
            onClick={fetchFilteredTickets}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <FaSearch /> Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-md flex items-center gap-2"
          >
            <FaTrash /> Clear
          </button>
        </div>
      </div>

      {/* Export */}
      {allResults.length > 0 && (
        <div className="flex justify-between mb-3 text-sm text-gray-600">
          <span>Showing {tickets.length} of {allResults.length} tickets</span>
          <button
            onClick={exportAll}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaDownload /> Download Full Report
          </button>
        </div>
      )}

      {/* Results Table */}
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
    </div>
  );
};

export default Reports;
