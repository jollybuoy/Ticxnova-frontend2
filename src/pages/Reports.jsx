import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";

import { FaDownload, FaFilter, FaUserShield, FaBuilding, FaBug, FaClipboardList, FaClock } from "react-icons/fa";
import logo from "../assets/ticxnova-logo.png";

const Reports = () => {
  const [reportData, setReportData] = useState({
    byStatus: [],
    byPriority: [],
    byType: [],
    byDepartment: [],
    monthly: []
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/simple`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportData(response.data);
      } catch (err) {
        console.error("❌ Report fetch failed:", err);
      }
    };

    fetchReports();
  }, []);

  const exportCSV = async (data, filename) => {
    const { saveAs } = await import("file-saver");
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  const SectionCard = ({ title, icon, data, keys, fileName }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          {icon}
          <span>{title}</span>
        </div>
        <button
          onClick={() => exportCSV(data, fileName)}
          className="text-sm flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
        >
          <FaDownload /> Export CSV
        </button>
      </div>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            {keys.map((key) => (
              <th key={key} className="text-left p-2 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {keys.map((key) => (
                  <td key={key} className="p-2 border">{row[key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={keys.length} className="p-4 text-center text-gray-400">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-slate-100">
      <header className="flex items-center gap-4 mb-6">
        <img src={logo} alt="Ticxnova Logo" className="h-10 w-10 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">📄 Ticket Reports</h1>
      </header>

      {/* Filters (optional for future functionality) */}
      <div className="bg-white rounded-xl shadow mb-6 p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <FaFilter className="text-blue-600" />
          <span className="font-semibold">Filters:</span>
        </div>
        <input type="date" className="px-3 py-2 rounded bg-gray-100 text-sm" />
        <input type="date" className="px-3 py-2 rounded bg-gray-100 text-sm" />
        <input type="text" placeholder="Assigned To" className="px-3 py-2 rounded bg-gray-100 text-sm" />
        <select className="px-3 py-2 rounded bg-gray-100 text-sm">
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {/* Report Sections */}
      <SectionCard
        title="Tickets by Status"
        icon={<FaClipboardList className="text-blue-600" />}
        data={reportData.byStatus}
        keys={["status", "count"]}
        fileName="tickets_by_status"
      />

      <SectionCard
        title="Tickets by Priority"
        icon={<FaBug className="text-red-500" />}
        data={reportData.byPriority}
        keys={["priority", "count"]}
        fileName="tickets_by_priority"
      />

      <SectionCard
        title="Tickets by Type"
        icon={<FaClock className="text-purple-500" />}
        data={reportData.byType}
        keys={["ticketType", "count"]}
        fileName="tickets_by_type"
      />

      <SectionCard
        title="Tickets by Department"
        icon={<FaBuilding className="text-green-600" />}
        data={reportData.byDepartment}
        keys={["department", "count"]}
        fileName="tickets_by_department"
      />

      <SectionCard
        title="Tickets Created Monthly"
        icon={<FaUserShield className="text-pink-600" />}
        data={reportData.monthly}
        keys={["month", "count"]}
        fileName="monthly_ticket_trend"
      />
    </div>
  );
};

export default Reports;
