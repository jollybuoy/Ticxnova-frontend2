import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
const exportCSV = async (data, filename) => {
  const { saveAs } = await import("file-saver"); // ✅ Load at runtime only
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
};

const Reports = () => {
  const [reportData, setReportData] = useState({
    byStatus: [],
    byPriority: [],
    byType: [],
    byDepartment: [],
    monthly: []
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/simple`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportData(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch report:", err);
      }
    };

    fetchReport();
  }, []);

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  const ReportTable = ({ title, data, keys, exportName }) => (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={() => exportCSV(data, exportName)}
          className="text-sm text-blue-600 hover:underline"
        >
          Download CSV
        </button>
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            {keys.map((key) => (
              <th key={key} className="text-left p-2 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {keys.map((key) => (
                <td key={key} className="p-2 border">{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-white">
      <div className="flex items-center gap-3 mb-6">
        <img src="/ticxnova-logo.png" alt="Ticxnova Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">📄 Ticket Reports</h1>
      </div>

      <ReportTable
        title="Tickets by Status"
        data={reportData.byStatus}
        keys={["status", "count"]}
        exportName="tickets_by_status"
      />

      <ReportTable
        title="Tickets by Priority"
        data={reportData.byPriority}
        keys={["priority", "count"]}
        exportName="tickets_by_priority"
      />

      <ReportTable
        title="Tickets by Type"
        data={reportData.byType}
        keys={["ticketType", "count"]}
        exportName="tickets_by_type"
      />

      <ReportTable
        title="Tickets by Department"
        data={reportData.byDepartment}
        keys={["department", "count"]}
        exportName="tickets_by_department"
      />

      <ReportTable
        title="Tickets Created Monthly"
        data={reportData.monthly}
        keys={["month", "count"]}
        exportName="monthly_ticket_trend"
      />
    </div>
  );
};

export default Reports;
