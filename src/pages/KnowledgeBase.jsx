// src/pages/KnowledgeBase.jsx
import React, { useState } from "react";
import { FiFileText, FiSearch, FiBookOpen, FiDownload } from "react-icons/fi";

const sampleDocuments = [
  {
    id: 1,
    title: "Reset Active Directory Password",
    description: "Step-by-step guide to reset your AD password.",
    tags: ["Active Directory", "Password", "Security"],
    updatedAt: "2025-04-25",
    type: "PDF",
  },
  {
    id: 2,
    title: "Multi-Factor Authentication Setup",
    description: "How to configure MFA for your account securely.",
    tags: ["Security", "MFA"],
    updatedAt: "2025-04-20",
    type: "PDF",
  },
  {
    id: 3,
    title: "VPN Access Guide",
    description: "Connect to VPN on Windows and Mac devices.",
    tags: ["VPN", "Remote Work"],
    updatedAt: "2025-04-18",
    type: "DOCX",
  },
];

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = sampleDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 min-h-screen bg-white text-gray-800">
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiBookOpen className="text-blue-600" /> Knowledge Base
        </h1>
        <p className="text-gray-500 mt-2">Explore our official SOP (Standard Operating Procedure) documents.</p>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative w-80">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search SOPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <FiFileText className="text-blue-500" /> {doc.title}
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{doc.type}</span>
            </div>
            <p className="text-gray-700 text-sm mb-4">{doc.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {doc.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full text-xs text-gray-600">#{tag}</span>
              ))}
            </div>
            <div className="flex justify-between text-gray-400 text-xs">
              <div>📅 {doc.updatedAt}</div>
              <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                <FiDownload /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No documents found.
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
