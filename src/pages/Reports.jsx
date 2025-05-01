// src/pages/Reports.jsx
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import 'chart.js/auto';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [filters, setFilters] = useState({
    priority: [],
    department: [],
    status: [],
    type: [],
    assignee: [],
    dateRange: "",
    search: ""
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

  const summaryCards = [
    { label: "Total Tickets", value: 100, note: "+5%", desc: "Total number of tickets in this report" },
    { label: "Open Tickets", value: 26, note: "-2%", desc: "Tickets that need attention" },
    { label: "Resolved Tickets", value: 66, note: "+12%", desc: "Successfully closed tickets" },
    { label: "Critical Issues", value: 19, note: "+3", desc: "P1 priority tickets" },
    { label: "Avg. Resolution Time", value: "1d 11h", desc: "Average time to resolve tickets" },
    { label: "Created Today", value: 6, note: "+3", desc: "New tickets created today" },
    { label: "Top Department", value: "Sales", desc: "Department with most tickets" },
    { label: "Top Assignee", value: "John Doe", desc: "Person with most assigned tickets" },
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
      { label: "Created", data: [5, 7, 6, 4, 5, 6, 7], borderColor: "#3b82f6", fill: false },
      { label: "Resolved", data: [3, 4, 5, 4, 4, 5, 5], borderColor: "#22c55e", fill: false },
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button className="bg-gray-100 px-3 py-2 rounded">Filters</button>
          <button onClick={handleDownloadCSV} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaDownload /> Export</button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 border-b">
        {['table', 'dashboard', 'charts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters Row (mocked) */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <select className="border rounded p-2"><option>Date Range</option></select>
          <select className="border rounded p-2"><option>Priority</option></select>
          <select className="border rounded p-2"><option>Department</option></select>
          <select className="border rounded p-2"><option>Type</option></select>
          <select className="border rounded p-2"><option>Status</option></select>
          <select className="border rounded p-2"><option>Assignee</option></select>
        </div>
      </div>

      {activeTab === 'table' && (
        <div className="overflow-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(ticketData[0]).map((header) => (
                  <th key={header} className="p-2 border text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ticketData.map((ticket, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(ticket).map((value, i) => (
                    <td key={i} className="p-2 border">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded shadow">
              <div className="text-sm text-gray-600">{card.label}</div>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.note && <div className="text-green-500 text-xs">{card.note}</div>}
              <div className="text-xs text-gray-500">{card.desc}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-2 font-semibold">Status Distribution</h3>
            <Doughnut data={statusDistribution} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-2 font-semibold">Tickets by Priority</h3>
            <Bar data={ticketsByPriority} />
          </div>
          <div className="bg-white p-4 rounded shadow col-span-1 xl:col-span-2">
            <h3 className="mb-2 font-semibold">Ticket Trends</h3>
            <Line data={ticketTrends} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
