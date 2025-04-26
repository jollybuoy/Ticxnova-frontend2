// src/pages/KnowledgeBase.jsx
import React, { useEffect, useState } from "react";
import { FiFileText, FiSearch, FiDownloadCloud, FiFilter } from "react-icons/fi";
import axios from "axios";

const KnowledgeBase = () => {
  const [sops, setSops] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSOPs();
  }, []);

  const fetchSOPs = async () => {
    try {
      const response = await axios.get("/api/sop");
      setSops(response.data);
    } catch (err) {
      console.error("Failed to fetch SOPs", err);
    }
  };

  const filteredSOPs = sops.filter((sop) =>
    sop.title.toLowerCase().includes(search.toLowerCase()) ||
    sop.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-700 mb-2 flex items-center gap-3">
            <FiFileText className="text-blue-600" /> Knowledge Base (SOPs)
          </h1>
          <p className="text-gray-600">Browse official SOP documents uploaded by Admin.</p>
        </div>
        <div className="relative mt-4 md:mt-0">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSOPs.map((sop) => (
          <div key={sop.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-2 line-clamp-2">
                {sop.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{sop.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                {sop.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <div className="flex items-center gap-1">
                <FiFilter /> {sop.type.toUpperCase()}
              </div>
              <div>
                📅 {new Date(sop.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => window.open(`/uploads/${sop.fileName}`, "_blank")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 w-full justify-center"
            >
              <FiDownloadCloud /> View / Download
            </button>
          </div>
        ))}
      </div>

      {filteredSOPs.length === 0 && (
        <div className="text-center text-gray-400 mt-20">No SOPs found.</div>
      )}
    </div>
  );
};

export default KnowledgeBase;
