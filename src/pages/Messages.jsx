// src/pages/Messages.jsx
import React, { useState } from "react";
import {
  FiMail,
  FiSearch,
  FiDownload,
  FiInbox,
  FiRefreshCw,
  FiSend
} from "react-icons/fi";

const mockEmails = [
  {
    id: 1,
    subject: "Welcome to Outlook Integration",
    from: "admin@contoso.com",
    date: "2025-04-16 09:30 AM",
    body: "This is a mock preview of an Outlook email shown inside your application.",
    hasAttachments: false
  },
  {
    id: 2,
    subject: "Ticket Update - SR-1224",
    from: "it-support@contoso.com",
    date: "2025-04-15 05:14 PM",
    body: "Your service request SR-1224 has been approved and assigned.",
    hasAttachments: true
  },
  {
    id: 3,
    subject: "Monthly SLA Report - March 2025",
    from: "noreply@contoso.com",
    date: "2025-04-01 08:00 AM",
    body: "Please find the attached SLA compliance report for March 2025.",
    hasAttachments: true
  }
];

const Messages = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: "", subject: "", body: "" });

  const filtered = mockEmails.filter(
    (email) =>
      email.subject.toLowerCase().includes(search.toLowerCase()) ||
      email.from.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    alert("📧 Mock email sent to " + composeForm.to);
    setComposeForm({ to: "", subject: "", body: "" });
    setShowCompose(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FiInbox className="text-blue-600" /> Outlook Inbox (Demo)
        </h1>
        <p className="text-sm text-gray-500">
          Preview of Microsoft Outlook emails inside your app using Microsoft Graph.
        </p>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <div className="relative w-72">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or sender..."
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 w-full outline-none"
          />
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          <FiRefreshCw /> Refresh
        </button>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <FiSend /> New Message
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r pr-4 overflow-y-auto max-h-[70vh]">
          {filtered.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelected(email)}
              className={`p-4 rounded-lg cursor-pointer border mb-3 shadow-sm hover:shadow-md transition ${
                selected?.id === email.id ? "bg-blue-50 border-blue-400" : "bg-white"
              }`}
            >
              <p className="font-bold text-gray-800 line-clamp-1">{email.subject}</p>
              <p className="text-sm text-gray-500 line-clamp-1">{email.from}</p>
              <p className="text-xs text-gray-400">{email.date}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 border rounded-lg p-6 shadow bg-gray-50 min-h-[50vh]">
          {selected ? (
            <>
              <h2 className="text-xl font-bold mb-1">{selected.subject}</h2>
              <p className="text-sm text-gray-500 mb-2">
                From: <span className="text-gray-700">{selected.from}</span>
              </p>
              <p className="text-xs text-gray-400 mb-4">📅 {selected.date}</p>
              <p className="text-base text-gray-800 whitespace-pre-line mb-6">{selected.body}</p>
              {selected.hasAttachments && (
                <button className="flex items-center gap-2 text-blue-600 mb-4">
                  <FiDownload /> Download Attachment
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                <FiMail /> Reply
              </button>
            </>
          ) : (
            <p className="text-gray-500">📬 Select an email to preview...</p>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">✉️ Compose Message</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <input
                type="email"
                name="to"
                placeholder="To (email address)"
                value={composeForm.to}
                onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={composeForm.subject}
                onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                name="body"
                placeholder="Message body..."
                rows={5}
                value={composeForm.body}
                onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  <FiSend /> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
