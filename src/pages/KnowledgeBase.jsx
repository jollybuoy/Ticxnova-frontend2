import React, { useState, useEffect } from "react";
import { FiFileText, FiSearch, FiBookOpen, FiDownload } from "react-icons/fi";
import { getAllSopDocuments } from "../services/sopService"; // We'll fetch from backend

const KnowledgeBase = () => {
  const [sopDocuments, setSopDocuments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await getAllSopDocuments();
        setSopDocuments(docs);
      } catch (err) {
        console.error("Failed to load SOP documents:", err);
      }
    };
    fetchDocs();
  }, []);

  const filteredDocs = sopDocuments.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800">
      <div className="mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiBookOpen className="text-blue-700" /> Knowledge Base
        </h1>
        <p className="text-sm text-gray-500 mt-1">Access important SOPs and Guides uploaded by Admins.</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="relative w-80">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tag..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-2xl shadow-xl bg-gradient-to-br from-white to-blue-50 p-6 transform transition-transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-blue-200 duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-lg text-blue-700">
                <FiFileText className="text-blue-500" /> {doc.title}
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                {doc.fileType}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-3 line-clamp-3">{doc.description}</p>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
              {doc.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full">#{tag}</span>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <div>📅 {doc.updatedAt}</div>
            </div>

            <div className="mt-4 flex justify-end">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center gap-2 text-sm"
              >
                <FiDownload /> View Document
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No documents found.
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
