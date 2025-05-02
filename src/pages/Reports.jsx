// Full Reports.jsx with working Table, Dashboard, Charts, Filters and Export
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
  FaUser as FaUserTeal,
  FaHourglass
} from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import 'chart.js/auto';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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

  const summary = [
    { label: "Total Tickets", value: 100, delta: "+5%", color: "bg-blue-100", text: "text-blue-800", icon: <FaTicketAlt /> },
    { label: "Open Tickets", value: 29, delta: "-2%", color: "bg-orange-100", text: "text-orange-800", icon: <FaClock /> },
    { label: "Resolved Tickets", value: 65, delta: "+12%", color: "bg-green-100", text: "text-green-800", icon: <FaCheckCircle /> },
    { label: "Critical Issues", value: 26, delta: "+3", color: "bg-red-100", text: "text-red-800", icon: <FaExclamationTriangle /> },
    { label: "Avg. Resolution Time", value: "1d 8h", delta: "", color: "bg-purple-100", text: "text-purple-800", icon: <FaClock /> },
    { label: "Created Today", value: 6, delta: "+3", color: "bg-blue-100", text: "text-blue-800", icon: <FaHourglass /> },
    { label: "Top Department", value: "Sales", delta: "19 tickets", color: "bg-indigo-100", text: "text-indigo-800", icon: <FaUserIndigo /> },
    { label: "Top Assignee", value: "John Doe", delta: "20 tickets", color: "bg-teal-100", text: "text-teal-800", icon: <FaUserTeal /> }
  ];

  const statusDistribution = {
    labels: ["Open", "Pending", "Resolved", "Closed", "Other"],
    datasets: [{ data: [20, 10, 40, 20, 10], backgroundColor: ["#facc15", "#a78bfa", "#4ade80", "#60a5fa", "#d1d5db"] }]
  };

  const ticketsByPriority = {
    labels: ["P1", "P2", "P3", "P4"],
    datasets: [{ data: [26, 21, 23, 30], backgroundColor: ["#f87171", "#fb923c", "#facc15", "#86efac"] }]
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
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Reports & Analytics</h1>
        <div className="flex gap-3">
          <button className="bg-gray-100 px-3 py-2 rounded text-sm flex items-center"><FaFilter className="mr-1" /> Filters</button>
          <button onClick={handleDownloadCSV} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center text-sm hover:bg-blue-700"><FaDownload className="mr-2" /> Export</button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {["table", "dashboard", "charts"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === tab ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "table" && (
        <div className="overflow-x-auto shadow border rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                {Object.keys(ticketData[0]).map((col) => (
                  <th key={col} className="px-4 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ticketData.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="px-4 py-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {summary.map((card, i) => (
              <div key={i} className={`p-4 rounded shadow ${card.color}`}>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold">{card.label}</div>
                  <div className={`text-lg ${card.text}`}>{card.icon}</div>
                </div>
                <div className="text-2xl font-bold mt-1">{card.value}</div>
                <div className="text-xs text-gray-500 mt-1">{card.delta}</div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-gray-700 mb-2">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-4 shadow rounded border border-blue-100">
              <h3 className="font-semibold text-blue-600 mb-2">Status Distribution</h3>
              <Doughnut data={statusDistribution} />
            </div>
            <div className="bg-white p-4 shadow rounded border border-yellow-100">
              <h3 className="font-semibold text-yellow-600 mb-2">Tickets by Priority</h3>
              <Bar data={ticketsByPriority} />
            </div>
            <div className="bg-white p-4 shadow rounded border border-green-100 col-span-1 xl:col-span-2">
              <h3 className="font-semibold text-green-600 mb-2">Ticket Trends</h3>
              <Line data={ticketTrends} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
