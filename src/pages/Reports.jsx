import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { components } from "react-select";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import logo from "../assets/ticxnova-logo.png";

const OPTIONS = {
  priority: ["P1", "P2", "P3", "P4"],
  department: ["IT", "HR", "Finance", "Facilities"],
  type: ["Incident", "Service Request", "Change Request", "Problem", "Task"],
  status: ["Open", "Closed", "In Progress", "Resolved"]
};

const toOptions = (arr) => arr.map((v) => ({ value: v, label: v }));
const ALL_OPTION = (label) => ({ value: "*", label: `Select All` });

const customStyles = {
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
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px"
  }),
  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: 8
  }),
  placeholder: (base) => ({
    ...base,
    color: "#64748b"
  }),
  singleValue: () => ({}),
  multiValue: () => ({}), // hide pills
};

const ValueContainer = ({ getValue, selectProps, ...props }) => {
  const selected = getValue();
  const label = selected.length > 0 ? `${selected.length} selected` : "Select...";
  return (
    <components.ValueContainer {...props}>
      <div className="text-sm text-gray-700">{label}</div>
    </components.ValueContainer>
  );
};

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
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priority: [ALL_OPTION(), ...toOptions(OPTIONS.priority)],
    department: [ALL_OPTION(), ...toOptions(OPTIONS.department)],
    type: [ALL_OPTION(), ...toOptions(OPTIONS.type)],
    status: [ALL_OPTION(), ...toOptions(OPTIONS.status)]
  });

  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const handleChange = (key, value) => {
    const isSelectAll = value?.some((v) => v.value === "*");
    setFilters((prev) => ({
      ...prev,
      [key]: isSelectAll ? [ALL_OPTION(), ...toOptions(OPTIONS[key])] : value.filter((v) => v.value !== "*")
    }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    const appendIfValid = (key) => {
      if (filters[key]?.length && filters[key][0]?.value !== "*") {
        params.append(key, filters[key].map((v) => v.value).join(","));
      }
    };
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    ["priority", "department", "type", "status"].forEach(appendIfValid);
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
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const exportCSV = () => {
    const csv = Papa.unparse(allTickets);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Ticxnova_Report.csv");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Ticxnova Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-3xl font-bold text-gray-800">📄 Ticket Reports</h1>
        </div>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="date"
          className="px-3 py-2 rounded bg-gray-100 text-sm"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          className="px-3 py-2 rounded bg-gray-100 text-sm"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        {["priority", "department", "type", "status"].map((key) => (
          <Select
            key={key}
            isMulti
            closeMenuOnSelect={false}
            options={[ALL_OPTION(), ...toOptions(OPTIONS[key])]}
            value={filters[key]}
            onChange={(val) => handleChange(key, val)}
            placeholder={`Select ${key}`}
            styles={customStyles}
            components={{ Option: CheckboxOption, ValueContainer }}
          />
        ))}
      </div>

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
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-400">No tickets to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
