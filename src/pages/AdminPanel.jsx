// src/pages/AdminPanel.jsx
import React, { useState } from "react";
import {
  FiUsers,
  FiSettings,
  FiActivity,
  FiShield,
  FiDatabase,
  FiClock,
  FiBookOpen,
  FiZap,
  FiBell
} from "react-icons/fi";

const sections = [
  { id: "users", label: "User Management", icon: <FiUsers />, description: "Manage roles, permissions, and sync with AD." },
  { id: "org", label: "Org Settings", icon: <FiSettings />, description: "Edit domain, time zone, branding, and defaults." },
  { id: "templates", label: "Ticket Templates", icon: <FiBookOpen />, description: "Create templates for ticket types and workflows." },
  { id: "sla", label: "SLA Management", icon: <FiClock />, description: "Configure SLA durations by priority or department." },
  { id: "logs", label: "Audit Logs", icon: <FiActivity />, description: "Track all user and admin activities." },
  { id: "integrations", label: "Integrations", icon: <FiZap />, description: "Connect Microsoft 365, Slack, Google and more." },
  { id: "security", label: "Security Policies", icon: <FiShield />, description: "Set password, 2FA, and session policies." },
  { id: "announcements", label: "System Announcements", icon: <FiBell />, description: "Publish alerts or banners to all users." },
  { id: "data", label: "Data Management", icon: <FiDatabase />, description: "Manage backups, archives, and data exports." }
];

const AdminPanel = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">🛠 AdminPanel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.label}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all border border-slate-200 cursor-pointer hover:border-blue-500"
            >
              <div className="text-blue-600 text-3xl mb-4">{section.icon}</div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">{section.label}</h2>
              <p className="text-sm text-slate-600">{section.description}</p>
              <button className="mt-4 inline-block text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
