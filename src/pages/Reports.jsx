import React, { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTicketAlt,
  FaClock,
} from "react-icons/fa";

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
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Reports & Analytics</h1>
        <button
          onClick={() => console.log("Export functionality here")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center text-sm hover:bg-blue-700"
        >
          <FaDownload className="mr-2" /> Export
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-gray-100 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Date Range:</label>
            <input
              type="date"
              className="border p-2 rounded w-full mb-2"
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
              className="border p-2 rounded w-full"
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
            <label className="block text-sm font-medium mb-1">Priority:</label>
            {priorityOptions.map((priority) => (
              <div key={priority} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) =>
                    handleFilterChange("priority", priority, e.target.checked)
                  }
                />
                <span>{priority}</span>
              </div>
            ))}
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Status:</label>
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) =>
                    handleFilterChange("status", status, e.target.checked)
                  }
                />
                <span>{status}</span>
              </div>
            ))}
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Department:</label>
            {departmentOptions.map((department) => (
              <div key={department} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) =>
                    handleFilterChange("department", department, e.target.checked)
                  }
                />
                <span>{department}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {activeTab === "table" && (
        <div className="overflow-x-auto shadow border rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                {Object.keys(ticketData[0]).map((col) => (
                  <th key={col} className="px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="px-4 py-2">
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
