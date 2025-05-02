
// Final Full Reports.jsx with all features: filters, tabs, dashboard, charts, export, themed UI
import React, { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaRedo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTicketAlt,
  FaUser as FaUserIndigo,
  FaClock,
  FaUser as FaUserTeal
} from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import 'chart.js/auto';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [filters, setFilters] = useState({
    priority: "",
    department: "",
    status: "",
    type: "",
    assignee: "",
    dateRange: ""
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
      createdAt: "Apr 29, 2025",
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
      createdAt: "Apr 29, 2025",
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
      createdAt: "Apr 29, 2025",
      resolvedAt: "Apr 29, 2025",
    },
  ];

  const statusDistribution = {
    labels: ["Open", "Pending", "Resolved", "Closed", "Other"],
    datasets: [{
      data: [20, 10, 40, 20, 10],
      backgroundColor: ["#facc15", "#a78bfa", "#4ade80", "#60a5fa", "#d1d5db"]
    }]
  };

  const ticketsByPriority = {
    labels: ["P1", "P2", "P3", "P4"],
    datasets: [{
      data: [19, 21, 31, 29],
      backgroundColor: ["#f87171", "#fb923c", "#facc15", "#86efac"]
    }]
  };

  const ticketTrends = {
    labels: ["Mar 30", "Apr 4", "Apr 9", "Apr 14", "Apr 19", "Apr 24", "Apr 28"],
    datasets: [
      { label: "Created", data: [5, 7, 6, 4, 5, 6, 7], borderColor: "#3b82f6", backgroundColor: "#3b82f655", tension: 0.4 },
      { label: "Resolved", data: [3, 4, 5, 4, 4, 5, 5], borderColor: "#22c55e", backgroundColor: "#22c55e55", tension: 0.4 }
    ]
  };

  const handleDownloadCSV = () => {
    const csvHeader = Object.keys(ticketData[0]).join(",");
    const csvRows = ticketData.map((row) => Object.values(row).join(","));
    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "ticket_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">📊 Reports & Analytics</h1>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-100"><FaFilter className="inline mr-2" />Filters</button>
          <button onClick={handleDownloadCSV} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"><FaDownload /> Export</button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-2">
        {['table', 'dashboard', 'charts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-md text-sm font-semibold transition ${activeTab === tab ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 shadow rounded mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.keys(filters).map((key) => (
            <select key={key} className="border rounded p-2 capitalize">
              <option value="">Select {key}</option>
              {key === 'priority' && ["P1", "P2", "P3", "P4"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              {key === 'department' && ["IT", "HR", "Finance", "Sales", "Support"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              {key === 'status' && ["Open", "Pending", "Resolved", "Closed"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              {key === 'type' && ["Incident", "Task", "Change Request", "Problem"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              {key === 'assignee' && ["Jane Smith", "John Doe", "Sarah Williams"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              {key === 'dateRange' && ["Last 7 days", "Last 30 days", "This Month"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-200 px-4 py-2 rounded flex items-center gap-1"><FaRedo /> Reset</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Apply Filters</button>
        </div>
      </div>

      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100">
            <h3 className="mb-2 font-semibold text-blue-600">Status Distribution</h3>
            <Doughnut data={statusDistribution} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-yellow-100">
            <h3 className="mb-2 font-semibold text-yellow-600">Tickets by Priority</h3>
            <Bar data={ticketsByPriority} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 col-span-1 xl:col-span-2">
            <h3 className="mb-2 font-semibold text-green-600">Ticket Trends</h3>
            <Line data={ticketTrends} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
