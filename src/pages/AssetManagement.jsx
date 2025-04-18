// src/pages/AssetManagement.jsx
import React, { useEffect, useState } from "react";
import { FiMonitor, FiPhone, FiEdit, FiCheckCircle, FiSearch } from "react-icons/fi";

const dummyAssets = [
  {
    id: "ASSET-1001",
    type: "Laptop",
    assignedTo: "john.doe@contoso.com",
    department: "IT",
    purchaseDate: "2023-03-15",
    warrantyUntil: "2026-03-15",
    status: "In Use",
  },
  {
    id: "ASSET-1002",
    type: "Monitor",
    assignedTo: "jane.smith@contoso.com",
    department: "Finance",
    purchaseDate: "2022-11-01",
    warrantyUntil: "2025-11-01",
    status: "Returned",
  },
  {
    id: "ASSET-1003",
    type: "Phone",
    assignedTo: "alex.lee@contoso.com",
    department: "HR",
    purchaseDate: "2024-01-20",
    warrantyUntil: "2027-01-20",
    status: "In Use",
  },
];

const statusColor = {
  "In Use": "bg-green-500",
  Returned: "bg-gray-400",
  Repair: "bg-yellow-500",
  Lost: "bg-red-500",
};

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setAssets(dummyAssets);
  }, []);

  const filteredAssets = assets.filter((asset) =>
    asset.id.toLowerCase().includes(search.toLowerCase()) ||
    asset.assignedTo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">📦 Asset Management</h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute top-3 left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by asset ID or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white rounded-lg shadow text-slate-700 border border-slate-200"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-slate-600">
              <th>ID</th>
              <th>Type</th>
              <th>Assigned To</th>
              <th>Department</th>
              <th>Purchased</th>
              <th>Warranty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr
                key={asset.id}
                className="bg-white rounded-lg shadow border border-slate-200 text-slate-700"
              >
                <td className="p-3 font-semibold">{asset.id}</td>
                <td className="p-3 flex items-center gap-2">
                  {asset.type === "Laptop" && <FiMonitor />} {asset.type === "Monitor" && <FiMonitor />} {asset.type === "Phone" && <FiPhone />} {asset.type}
                </td>
                <td className="p-3">{asset.assignedTo}</td>
                <td className="p-3">{asset.department}</td>
                <td className="p-3">{asset.purchaseDate}</td>
                <td className="p-3">{asset.warrantyUntil}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full text-white ${statusColor[asset.status]}`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <FiCheckCircle />
                  </button>
                </td>
              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-slate-400">
                  No assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetManagement;
