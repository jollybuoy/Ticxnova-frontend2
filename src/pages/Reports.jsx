import React, { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaChartPie,
  FaCalendarAlt,
  FaTasks,
  FaCircle,
  FaTrophy,
} from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

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
      createdAt: "2025-05-01T03:30:00",
      resolvedAt: "2025-05-01T04:30:00",
    },
    {
      ticketId: "TIC-1031",
      type: "Incident",
      priority: "P1",
      status: "Resolved",
      subject: "Sample Ticket 32",
      assignedTo: "Jane Smith",
      department: "HR",
      createdAt: "2025-05-01T02:00:00",
      resolvedAt: "2025-05-01T03:45:00",
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

  const filteredTickets = ticketData.filter((ticket) => {
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

  const handleFilterChange = (key, selectedOptions) => {
    setFilters((prev) => ({
      ...prev,
      [key]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleGenerateReport = () => {
    alert("Report generated! (This can be extended to export CSV/PDF files)");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-800">
          📊 Reports & Analytics
        </h1>
      </div>

      {/* Analytics Section */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <FaTrophy className="inline mr-2 text-yellow-500" /> Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Total Tickets</h3>
            <p className="text-4xl font-bold text-purple-900">{ticketData.length}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">Resolved Tickets</h3>
            <p className="text-4xl font-bold text-green-900">
              {filteredTickets.filter((ticket) => ticket.status === "Resolved").length}
            </p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Open Tickets</h3>
            <p className="text-4xl font-bold text-blue-900">
              {filteredTickets.filter((ticket) => ticket.status === "Open").length}
            </p>
          </div>
        </div>
      </div>

      {/* Reports Filtering */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <FaFilter className="inline mr-2 text-green-500" /> Reports Filtering
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Range Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-blue-500" /> Date Range
            </label>
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

          {/* Priority Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              <FaTasks className="inline mr-2 text-purple-500" /> Priority
            </label>
            <Select
              options={[
                { value: "P1", label: "P1" },
                { value: "P2", label: "P2" },
                { value: "P3", label: "P3" },
              ]}
              isMulti
              onChange={(selected) => handleFilterChange("priority", selected)}
              className="text-gray-700"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              <FaCircle className="inline mr-2 text-red-500" /> Status
            </label>
            <Select
              options={[
                { value: "Open", label: "Open" },
                { value: "Resolved", label: "Resolved" },
                { value: "Pending", label: "Pending" },
              ]}
              isMulti
              onChange={(selected) => handleFilterChange("status", selected)}
              className="text-gray-700"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              <FaChartPie className="inline mr-2 text-orange-500" /> Department
            </label>
            <Select
              options={[
                { value: "Sales", label: "Sales" },
                { value: "HR", label: "HR" },
                { value: "Legal", label: "Legal" },
              ]}
              isMulti
              onChange={(selected) => handleFilterChange("department", selected)}
              className="text-gray-700"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleGenerateReport}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-indigo-700 flex items-center"
          >
            <FaDownload className="mr-2" /> Generate Report
          </button>
        </div>
      </div>

      {/* Filtered Tickets Table */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Filtered Tickets</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Ticket ID</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Assigned To</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Resolved At</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.ticketId} className="border-t">
                <td className="px-4 py-2">{ticket.ticketId}</td>
                <td className="px-4 py-2">{ticket.subject}</td>
                <td className="px-4 py-2">{ticket.priority}</td>
                <td className="px-4 py-2">{ticket.status}</td>
                <td className="px-4 py-2">{ticket.assignedTo}</td>
                <td className="px-4 py-2">{ticket.department}</td>
                <td className="px-4 py-2">{ticket.createdAt}</td>
                <td className="px-4 py-2">{ticket.resolvedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
