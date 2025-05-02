import React, { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaChartPie,
  FaCalendarAlt,
  FaTasks,
  FaCircle,
  FaTrophy,
  FaUserTie,
  FaUsers,
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
      createdAt: "2025-04-01T03:30:00",
      resolvedAt: "2025-04-02T04:30:00",
    },
    {
      ticketId: "TIC-1031",
      type: "Incident",
      priority: "P1",
      status: "Resolved",
      subject: "Sample Ticket 32",
      assignedTo: "Jane Smith",
      department: "HR",
      createdAt: "2025-04-10T02:00:00",
      resolvedAt: "2025-04-11T03:45:00",
    },
    {
      ticketId: "TIC-1038",
      type: "Task",
      priority: "P2",
      status: "Resolved",
      subject: "Sample Ticket 39",
      assignedTo: "Sarah Williams",
      department: "Legal",
      createdAt: "2025-04-20T23:45:00",
      resolvedAt: "2025-04-21T00:30:00",
    },
  ];

  const handleFilterChange = (key, selectedOptions) => {
    setFilters((prev) => ({
      ...prev,
      [key]: selectedOptions.map((option) => option.value),
    }));
  };

  // Calculate analytics
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const topClosers = ticketData
    .filter((ticket) => new Date(ticket.resolvedAt) >= oneMonthAgo)
    .reduce((acc, ticket) => {
      acc[ticket.assignedTo] = (acc[ticket.assignedTo] || 0) + 1;
      return acc;
    }, {});

  const topAssignees = ticketData.reduce((acc, ticket) => {
    acc[ticket.assignedTo] = (acc[ticket.assignedTo] || 0) + 1;
    return acc;
  }, {});

  const topClosersData = Object.entries(topClosers)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const topAssigneesData = Object.entries(topAssignees)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

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
              {ticketData.filter((ticket) => ticket.status === "Resolved").length}
            </p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Open Tickets</h3>
            <p className="text-4xl font-bold text-blue-900">
              {ticketData.filter((ticket) => ticket.status === "Open").length}
            </p>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-lg font-bold text-yellow-700 mb-2">
              <FaUserTie className="inline mr-2 text-yellow-500" />
              Top Closers (Last Month)
            </h3>
            <ul className="text-yellow-900">
              {topClosersData.map((closer, index) => (
                <li key={index} className="font-medium">
                  {closer.name}: {closer.count} tickets
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-orange-100 rounded-lg shadow">
            <h3 className="text-lg font-bold text-orange-700 mb-2">
              <FaUsers className="inline mr-2 text-orange-500" />
              Top Assignees
            </h3>
            <ul className="text-orange-900">
              {topAssigneesData.map((assignee, index) => (
                <li key={index} className="font-medium">
                  {assignee.name}: {assignee.count} tickets
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reports Filtering */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <FaFilter className="inline mr-2 text-green-500" /> Reports Filtering
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      </div>

      {/* Ticket Trends */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <FaChartPie className="inline mr-2 text-red-500" /> Ticket Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ticketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" />
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
          <FaTasks className="inline mr-2 text-purple-500" /> Department Comparison
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ticketData}>
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
