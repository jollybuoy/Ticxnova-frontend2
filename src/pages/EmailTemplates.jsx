// src/pages/EmailTemplates.jsx
import React, { useState } from "react";
import { FiMail, FiEdit2, FiPlus, FiSearch, FiEye } from "react-icons/fi";

const dummyTemplates = [
  {
    id: "tmpl-001",
    name: "Ticket Created",
    subject: "Your ticket {ticketId} has been created",
    body: "Hi {userName},\n\nYour ticket {ticketId} has been logged. We will update you soon.\n\nThanks,\nTicxnova Support",
    updatedAt: "2024-04-01",
  },
  {
    id: "tmpl-002",
    name: "Status Update",
    subject: "Ticket {ticketId} status changed to {status}",
    body: "Hello {userName},\n\nTicket {ticketId} is now {status}.\n\nRegards,\nTicxnova Desk",
    updatedAt: "2024-03-29",
  }
];

const EmailTemplates = () => {
  const [templates, setTemplates] = useState(dummyTemplates);
  const [search, setSearch] = useState("");

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">📬 Email Templates</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <FiPlus /> Add Template
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute top-3 left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white rounded-lg shadow text-slate-700 border border-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-slate-200 rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-lg mb-2">
              <FiMail className="text-blue-500" />
              {template.name}
            </div>
            <p className="text-sm text-slate-500 mb-3">{template.subject}</p>
            <p className="text-xs text-slate-400 mb-4">Last updated: {template.updatedAt}</p>
            <div className="flex gap-3">
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                <FiEdit2 /> Edit
              </button>
              <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
                <FiEye /> Preview
              </button>
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-12">No templates found.</div>
        )}
      </div>
    </div>
  );
};

export default EmailTemplates;
