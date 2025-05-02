import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaFilter,
  FaChartPie,
  FaCalendarAlt,
  FaTasks,
  FaCircle,
  FaTrophy,
  FaUserTie,
  FaBuilding,
} from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";

const Reports = () => {
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    priority: [],
    status: [],
    department: [],
  });

  const ticketData = [
    {
      ticketId: "TIC-1028",
      type: "Task",
      priority: "P3",
      status: "Resolved",
      subject: "Sample Ticket 29",
      assignedTo: "Robert Brown",
      department: "Sales",
      createdAt: "2025-05-02T03:30:00",
      resolvedAt: "2025-05-02T04:30:00",
    },
    {
      ticketId: "TIC-1031",
      type: "Incident",
      priority: "P1",
      status: "Resolved",
      subject: "Sample Ticket 32",
      assignedTo: "Jane Smith",
      department: "HR",
      createdAt: "2025-05-02T02:00:00",
      resolvedAt: "2025-05-02T03:45:00",
    },
    {
      ticketId: "TIC-1038",
      type: "Task",
      priority: "P2",
      status: "Resolved",
      subject: "Sample Ticket 39",
      assignedTo: "Sarah Williams",
      department: "Legal",
      createdAt: "2025-05-01T23:45:00",
      resolvedAt: "2025-05-02T00:30:00",
    },
  ];

  const uniqueValues = (key) => {
    return [...new Set(ticketData.map((item) => item[key]))];
  };

  const priorityOptions = uniqueValues("priority").map((p) => ({
    value: p,
    label: p,
  }));
  const statusOptions = uniqueValues("status").map((s) => ({
    value: s,
    label: s,
  }));
  const departmentOptions = uniqueValues("department").map((d) => ({
    value: d,
    label: d,
  }));

  const handleFilterChange = (key, selectedOptions) => {
    setFilters((prev) => ({
      ...prev,
      [key]: selectedOptions.map((option) => option.value),
    }));
  };

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

  // Analytics Calculations
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const ticketsClosedLastHour = ticketData.filter((ticket) => {
    const resolvedAt = new Date(ticket.resolvedAt);
    return resolvedAt >= oneHourAgo && resolvedAt <= now;
  });

  const topAgents = [...new Set(ticketData.map((ticket) => ticket.assignedTo))].map(
    (agent) => ({
      agent,
      count: ticketData.filter((ticket) => ticket.assignedTo === agent).length,
    })
  );

  const topDepartments = [...new Set(ticketData.map((ticket) => ticket.department))].map(
    (department) => ({
      department,
      count: ticketData.filter((ticket) => ticket.department === department).length,
    })
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-800">
          📊 Reports & Analytics
        </h1>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-indigo-700 flex items-center">
          <FaDownload className="mr-2" /> Export
        </button>
      </div>

      {/* Analytics Section */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaTrophy /> Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Tickets Closed in Last Hour */}
          <div className="p-4 bg-blue-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Tickets Closed (Last Hour)
            </h3>
            <p className="text-4xl font-bold text-blue-900">
              {ticketsClosedLastHour.length}
            </p>
          </div>

          {/* Top Agents */}
          <div className="p-4 bg-green-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">Top Agents</h3>
            <ul className="text-green-900">
              {topAgents
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((agent, index) => (
                  <li key={index} className="font-medium">
                    {agent.agent}: {agent.count} tickets
                  </li>
                ))}
            </ul>
          </div>

          {/* Top Departments */}
          <div className="p-4 bg-yellow-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-yellow-700 mb-2">
              Top Departments
            </h3>
            <ul className="text-yellow-900">
              {topDepartments
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((dept, index) => (
                  <li key={index} className="font-medium">
                    {dept.department}: {dept.count} tickets
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaFilter /> Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Range Picker */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt /> Date Range:
            </label>
            <div className="flex gap-4">
              <DatePicker
                selected={filters.dateRange.start}
                onChange={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: date },
                  }))
                }
                selectsStart
                startDate={filters.dateRange.start}
                endDate={filters.dateRange.end}
                className="border p-2 rounded-md w-full"
                placeholderText="Start Date"
              />
              <DatePicker
                selected={filters.dateRange.end}
                onChange={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: date },
                  }))
                }
                selectsEnd
                startDate={filters.dateRange.start}
                endDate={filters.dateRange.end}
                className="border p-2 rounded-md w-full"
                placeholderText="End Date"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaTasks /> Priority:
            </label>
            <Select
              options={priorityOptions}
              isMulti
              onChange={(selected) => handleFilterChange("priority", selected)}
              className="text-gray-700"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCircle /> Status:
            </label>
            <Select
              options={statusOptions}
              isMulti
              onChange={(selected) => handleFilterChange("status", selected)}
              className="text-gray-700"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaChartPie /> Department:
            </label>
            <Select
              options={departmentOptions}
              isMulti
              onChange={(selected) => handleFilterChange("department", selected)}
              className="text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-indigo-500 text-white">
            <tr>
              {Object.keys(ticketData[0]).map((key) => (
                <th key={key} className="px-6 py-4">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-indigo-100`}
              >
                {Object.values(row).map((value, idx) => (
                  <td key={idx} className="px-6 py-4">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
