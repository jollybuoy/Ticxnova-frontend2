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

  const totalTickets = ticketData.length;
  const resolvedTickets = ticketData.filter((ticket) => ticket.status === "Resolved").length;
  const averageResolutionTime =
    ticketData
      .filter((ticket) => ticket.status === "Resolved")
      .reduce((sum, ticket) => {
        const createdAt = new Date(ticket.createdAt);
        const resolvedAt = new Date(ticket.resolvedAt);
        return sum + (resolvedAt - createdAt) / (60 * 1000); // Convert to minutes
      }, 0) / resolvedTickets || 0;

  const trendData = ticketData.map((ticket) => ({
    date: new Date(ticket.createdAt).toLocaleDateString(),
    created: 1,
    resolved: ticket.status === "Resolved" ? 1 : 0,
  }));

  const departmentComparisonData = [
    ...new Set(ticketData.map((ticket) => ticket.department)),
  ].map((department) => ({
    department,
    tickets: ticketData.filter((ticket) => ticket.department === department).length,
  }));

  const handleFilterChange = (key, selectedOptions) => {
    setFilters((prev) => ({
      ...prev,
      [key]: selectedOptions.map((option) => option.value),
    }));
  };

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
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <FaTrophy className="inline mr-2" /> Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Total Tickets</h3>
            <p className="text-4xl font-bold text-purple-900">{totalTickets}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">Resolved Tickets</h3>
            <p className="text-4xl font-bold text-green-900">{resolvedTickets}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Avg. Resolution Time</h3>
            <p className="text-4xl font-bold text-blue-900">
              {Math.round(averageResolutionTime)} mins
            </p>
          </div>
        </div>
      </div>

      {/* Reports Filtering */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <FaFilter className="inline mr-2" /> Reports Filtering
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" /> Date Range
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
          {/* Other filters */}
        </div>
      </div>

      {/* Ticket Trends */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Ticket Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created Tickets" />
            <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved Tickets" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Comparison */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Department Comparison
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tickets" fill="#8884d8" name="Tickets Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
