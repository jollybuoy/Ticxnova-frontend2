// src/pages/Reports.jsx
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

const Reports = () => {
  const [filters, setFilters] = useState({
    priority: [],
    department: [],
    status: [],
    type: [],
  });
  const [showReport, setShowReport] = useState(false);

  const ticketData = [
    // Dummy data — replace with API response
    {
      ticketId: "INC-001",
      type: "Incident",
      priority: "P1",
      status: "Open",
      assignedTo: "john@example.com",
      department: "IT",
      createdAt: "2025-04-10",
      resolvedAt: "",
      createdBy: "alice@example.com",
      resolvedBy: "",
    },
    // more dummy entries...
  ];

  const filterOptions = {
    priority: ["P1", "P2", "P3", "P4"],
    department: ["IT", "HR", "Finance", "Support"],
    status: ["Open", "Closed", "In Progress", "New"],
    type: ["Incident", "Change Request", "Service Request", "Problem"],
  };

  const handleSelectAll = (key) => {
    setFilters((prev) => ({ ...prev, [key]: [...filterOptions[key]] }));
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const selected = new Set(prev[key]);
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
      return { ...prev, [key]: [...selected] };
    });
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleDownloadCSV = () => {
    const csvHeader = Object.keys(ticketData[0]).join(",");
    const csvRows = ticketData.map((row) =>
      Object.values(row).join(",")
    );
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
      <h1 className="text-3xl font-semibold mb-6">Reports</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-end">
        {Object.keys(filterOptions).map((key) => (
          <div key={key} className="relative w-64">
            <div className="text-sm font-medium mb-1 capitalize">{key}</div>
            <div className="border rounded p-2 bg-white cursor-pointer shadow" onClick={() => document.getElementById(`${key}-dropdown`).classList.toggle("hidden")}> 
              {filters[key].length ? `${filters[key].length} selected` : "Select All"}
            </div>
            <div id={`${key}-dropdown`} className="absolute z-10 bg-white border rounded mt-1 p-2 hidden w-full max-h-60 overflow-y-auto">
              <label className="block"><input type="checkbox" onChange={() => handleSelectAll(key)} checked={filters[key].length === filterOptions[key].length} className="mr-2" />Select All</label>
              {filterOptions[key].map((option) => (
                <label key={option} className="block">
                  <input type="checkbox" className="mr-2" checked={filters[key].includes(option)} onChange={() => handleCheckboxChange(key, option)} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleGenerateReport}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Generate Report
        </button>
      </div>

      {/* Dashboard Section */}
      {showReport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-100 p-4 rounded shadow">Total Tickets: 120</div>
          <div className="bg-gray-100 p-4 rounded shadow">Open: 34</div>
          <div className="bg-gray-100 p-4 rounded shadow">Closed: 50</div>
          <div className="bg-gray-100 p-4 rounded shadow">Pending: 36</div>
        </div>
      )}

      {/* Report Table */}
      {showReport && (
        <div className="mt-10 overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(ticketData[0]).map((header) => (
                  <th key={header} className="p-2 border text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ticketData.slice(0, 50).map((ticket, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(ticket).map((value, i) => (
                    <td key={i} className="p-2 border">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleDownloadCSV}
            className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <FaDownload /> Download CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
