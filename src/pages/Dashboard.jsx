import React, { useEffect, useState } from "react";
import API from "../api/axios"; // ✅ Correct axios import

// Basic fallback Card components (if no UI lib is used)
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-300 bg-white p-4 shadow-md ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/tickets/dashboard/summary")
      .then((res) => {
        console.log("📊 Dashboard data:", res.data);
        setSummary(res.data);
      })
      .catch((err) => {
        console.error("❌ Dashboard fetch failed:", err);
        setError("Failed to load data.");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Total Tickets</h2>
              <p className="text-2xl mt-2">{summary.total ?? 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-blue-600">Open</h2>
              <p className="text-2xl mt-2">{summary.open ?? 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-green-600">Closed</h2>
              <p className="text-2xl mt-2">{summary.closed ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
