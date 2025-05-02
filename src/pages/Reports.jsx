import React, { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTicketAlt,
  FaClock,
  FaLayerGroup,
  FaCalendarAlt,
  FaBuilding,
  FaTasks,
} from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import 'chart.js/auto';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    priority: [],
    status: [],
    department: [],
  });

  const ticketData = [
    {
      ticketId: "TIC-1028",
      type: "Task",
      priority: "P3",
      status: "Open",
      subject: "Sample Ticket 29",
      assignedTo: "Robert Brown",
      department: "Sales",
      createdAt: "2025-04-29",
      resolvedAt: "-",
    },
    {
      ticketId: "TIC-1031",
      type: "Incident",
      priority: "P1",
      status: "Pending",
      subject: "Sample Ticket 32",
      assignedTo: "Jane Smith",
      department: "HR",
      createdAt: "2025-04-29",
      resolvedAt: "-",
    },
    {
      ticketId: "TIC-1038",
      type: "Task",
      priority: "P2",
      status: "Resolved",
      subject: "Sample Ticket 39",
      assignedTo: "Sarah Williams",
      department: "Legal",
      createdAt: "2025-04-29",
      resolvedAt: "2025-04-29",
    },
  ];

  const uniqueValues = (key) => {
    return [...new Set(ticketData.map((item) => item[key]))];
  };

  const priorityOptions = uniqueValues("priority");
  const statusOptions = uniqueValues("status");
  const departmentOptions = uniqueValues("department");

  const filteredData = ticketData.filter((ticket) => {
    const matchesDateRange =
      (!filters.dateRange.start ||
        new Date(ticket.createdAt) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end ||
        new Date(ticket.createdAt) <= new Date(filters.dateRange.end));

    const matchesPriority =
      filters.priority.length === 0 || filters.priority.includes(ticket.priority);

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(ticket.status);

    const matchesDepartment =
      filters.department.length === 0 ||
      filters.department.includes(ticket.department);

    return matchesDateRange && matchesPriority && matchesStatus && matchesDepartment;
  });

  const handleFilterChange = (filterKey, value, checked) => {
    setFilters((prev) => {
      const updatedValues = checked
        ? [...prev[filterKey], value]
        : prev[filterKey].filter((v) => v !== value);

      return { ...prev, [filterKey]: updatedValues };
    });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-800">📊 Reports & Analytics</h1>
        <button
          onClick={() => console.log("Export functionality here")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center text-lg hover:bg-indigo-700 shadow-lg"
        >
          <FaDownload className="mr-3" /> Export
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-6 bg-white shadow-lg rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaFilter /> Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Range Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt /> Date Range:
            </label>
            <input
              type="date"
              className="border p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-indigo-500 shadow-sm"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value },
                })
              }
              placeholder="Start Date"
            />
            <input
              type="date"
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 shadow-sm"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value },
                })
              }
              placeholder="End Date"
            />
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaTasks /> Priority:
            </label>
            {priorityOptions.map((priority) => (
              <div key={priority} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  onChange={(e) =>
                    handleFilterChange("priority", priority, e.target.checked)
                  }
                />
                <span className="text-gray-700 text-lg">{priority}</span>
              </div>
            ))}
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaLayerGroup /> Status:
            </label>
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  onChange={(e) =>
                    handleFilterChange("status", status, e.target.checked)
                  }
                />
                <span className="text-gray-700 text-lg">{status}</span>
              </div>
            ))}
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaBuilding /> Department:
            </label>
            {departmentOptions.map((department) => (
              <div key={department} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  onChange={(e) =>
                    handleFilterChange("department", department, e.target.checked)
                  }
                />
                <span className="text-gray-700 text-lg">{department}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {activeTab === "table" && (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="w-full text-lg text-left text-gray-700">
            <thead className="text-xl uppercase bg-indigo-500 text-white">
              <tr>
                {Object.keys(ticketData[0]).map((col) => (
                  <th key={col} className="px-6 py-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t ${
                    i % 2 === 0 ? "bg-indigo-50" : "bg-white"
                  } hover:bg-indigo-100`}
                >
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="px-6 py-4">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
