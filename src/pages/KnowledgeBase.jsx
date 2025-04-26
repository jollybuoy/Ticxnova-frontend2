// src/pages/KnowledgeBase.jsx
import React, { useEffect, useState } from "react";
import { FiFileText, FiSearch, FiDownload } from "react-icons/fi";
import axios from "axios";

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const [sops, setSops] = useState([]);

  useEffect(() => {
    const fetchSops = async () => {
      try {
        const res = await axios.get("/api/sop");
        setSops(res.data);
      } catch (err) {
        console.error("Failed to load SOPs", err);
      }
    };

    fetchSops();
  }, []);

  const filteredSops = sops.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    (doc.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-gradient-to-br from-white to-blue-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-2">
          <FiFileText className="text-blue-500" /> Standard Operating Procedures (SOPs)
        </h1>
        <p className="text-gray-600 mt-1">Explore all company policies, IT guides, and SOP documents.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SOPs..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSops.map((doc) => (
          <div key={doc.id} className="border border-gray-200 bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <FiFileText className="text-blue-500" /> {doc.title}
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">{doc.type}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">{doc.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(doc.tags || []).map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <div>📅 {doc.updatedAt?.split("T")[0]}</div>
              <a
                href={`/uploads/${doc.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <FiDownload /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSops.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No SOPs found.
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
