// src/pages/Settings.jsx
import React, { useState } from "react";
import {
  FiUser,
  FiBell,
  FiSettings,
  FiLock,
  FiBriefcase,
  FiUsers,
  FiLink
} from "react-icons/fi";

const tabs = [
  { id: "profile", label: "Profile", icon: <FiUser /> },
  { id: "notifications", label: "Notifications", icon: <FiBell /> },
  { id: "security", label: "Security", icon: <FiLock /> },
  { id: "organization", label: "Organization", icon: <FiBriefcase /> },
  { id: "roles", label: "User Roles", icon: <FiUsers /> },
  { id: "integrations", label: "Integrations", icon: <FiLink /> },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">👤 Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Full Name</label>
                <input type="text" placeholder="John Doe" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Email Address</label>
                <input type="email" placeholder="john@example.com" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Phone Number</label>
                <input type="text" placeholder="+1 555-1234" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Job Title</label>
                <input type="text" placeholder="IT Analyst" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Location</label>
                <input type="text" placeholder="Toronto, ON" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Preferred Language</label>
                <select className="p-3 border rounded-lg w-full">
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div className="col-span-full text-right mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Profile</button>
              </div>
            </div>
          </div>
        );
      case "organization":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">🏢 Organization Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Organization Name</label>
                <input type="text" placeholder="Contoso Inc." className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Support Contact Email</label>
                <input type="email" placeholder="support@contoso.com" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">SLA Duration (Hours)</label>
                <input type="number" placeholder="48" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Company Domain</label>
                <input type="text" placeholder="contoso.com" className="p-3 border rounded-lg w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Time Zone</label>
                <select className="p-3 border rounded-lg w-full">
                  <option>America/Toronto (EST)</option>
                  <option>America/Vancouver (PST)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Default Ticket Type</label>
                <select className="p-3 border rounded-lg w-full">
                  <option>Incident</option>
                  <option>Service Request</option>
                  <option>Task</option>
                </select>
              </div>
              <div className="col-span-full text-right mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Organization Settings</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6">⚙️ Settings</h1>
      <div className="flex gap-4 flex-wrap mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              activeTab === tab.id ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;
