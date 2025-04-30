import React, { useState } from "react";
import axios from "axios";
import Select, { components } from "react-select";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import {
  FaDownload, FaFilter, FaSearch, FaTrash, FaTimes,
} from "react-icons/fa";
import logo from "../assets/ticxnova-logo.png";

// Dropdown data
const OPTIONS = {
  priority: ["P1", "P2", "P3", "P4"],
  department: ["IT", "HR", "Finance", "Facilities"],
  type: ["Incident", "Service Request", "Change Request", "Problem", "Task"],
  status: ["Open", "Closed", "In Progress", "Resolved"]
};

const toOptions = (arr) => arr.map((v) => ({ value: v, label: v }));
const ALL_OPTION = (label) => ({ value: "*", label: `All ${label}` });

// Custom styles
const customStyles = {
  option: (base, { isSelected }) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
    backgroundColor: isSelected ? "#e0f2fe" : "#fff",
    color: "#000",
    padding: "8px 12px"
  }),
  control: (base) => ({
    ...base,
    minHeight: 42,
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    fontSize: "0.875rem"
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999
  }),
  multiValue: () => ({ display: "none" })
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
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priority: [ALL_OPTION("Priorities"), ...toOptions(OPTIONS.priority)],
    department: [ALL_OPTION("Departments"), ...toOptions(OPTIONS.department)],
    type: [ALL_OPTION("Types"), ...toOptions(OPTIONS.type)],
    status: [ALL_OPTION("Statuses"), ...toOptions(OPTIONS.status)]
  });

  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const handleChange = (key, value) => {
    const isSelectAll = value?.some((v) => v.value === "*");
    setFilters((prev) => ({
      ...prev,
      [key]: isSelectAll
        ? [ALL_OPTION(key), ...toOptions(OPTIONS[key])]
        : value.filter((v) => v.value !== "*")
    }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    const addParam = (key) => {
      if (filters[key]?.length && filters[key][0]?.value !== "*") {
        params.append(key, filters[key].map((v) => v.value).join(","));
      }
    };

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    ["priority", "department", "type", "status"].forEach(addParam);

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
      setShowModal(false);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(allTickets);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Ticxnova_Report.csv");
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      priority: [ALL_OPTION("Priorities"), ...toOptions(OPTIONS.priority)],
      department: [ALL_OPTION("Departments"), ...toOptions(OPTIONS.department)],
      type: [ALL_OPTION("Types"), ...toOptions(OPTIONS.type)],
      status: [ALL_OPTION("Statuses"), ...toOptions(OPTIONS.status)]
    });
    setTickets([]);
    setAllTickets([]);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Ticxnova Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-3xl font-bold text-gray-800">📄 Reports</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaFilter /> Filter
        </button>
      </div>

      {/* Export */}
      {tickets.length > 0 && (
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
              {["ticketId", "type", "priority", "status", "assignedTo", "department", "createdAt", "resolvedAt", "createdBy", "resolvedBy"].map((key) => (
                <th key={key} className="text-left p-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((t, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{t.ticketId}</td>
                  <td className="p-2 border">{t.type}</td>
                  <td className="p-2 border">{t.priority}</td>
                  <td className="p-2 border">{t.status}</td>
                  <td className="p-2 border">{t.assignedTo}</td>
                  <td className="p-2 border">{t.department}</td>
                  <td className="p-2 border">{t.createdAt}</td>
                  <td className="p-2 border">{t.resolvedAt || "-"}</td>
                  <td className="p-2 border">{t.createdBy}</td>
                  <td className="p-2 border">{t.resolvedBy || "-"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={10} className="p-4 text-center text-gray-400">No tickets to display</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">🔍 Filter Tickets</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                className="px-3 py-2 rounded bg-gray-100 text-sm"
                value={filters.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
              <input
                type="date"
                className="px-3 py-2 rounded bg-gray-100 text-sm"
                value={filters.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />

              {["priority", "department", "type", "status"].map((key) => (
                <Select
                  key={key}
                  isMulti
                  closeMenuOnSelect={false}
                  options={[ALL_OPTION(key), ...toOptions(OPTIONS[key])]}
                  value={filters[key]}
                  onChange={(val) => handleChange(key, val)}
                  placeholder={`Select ${key}`}
                  styles={customStyles}
                  components={{ Option: CheckboxOption, ValueContainer }}
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={fetchTickets}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaSearch /> Generate Report
              </button>
              <button
                onClick={clearFilters}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-md flex items-center gap-2"
              >
                <FaTrash /> Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
