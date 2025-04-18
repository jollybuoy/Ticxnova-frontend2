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
            <h2 className="text-xl font-semibold mb-4">👤 Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="p-3 border rounded-lg" />
              <input type="email" placeholder="Email Address" className="p-3 border rounded-lg" />
              <input type="text" placeholder="Phone Number" className="p-3 border rounded-lg" />
              <input type="text" placeholder="Job Title" className="p-3 border rounded-lg" />
              <input type="text" placeholder="Location" className="p-3 border rounded-lg" />
              <input type="text" placeholder="Preferred Language" className="p-3 border rounded-lg" />
              <button className="col-span-full bg-blue-600 text-white py-2 rounded-lg">Update Profile</button>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">🔔 Notification Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="accent-blue-600" defaultChecked />
                Enable desktop notifications
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="accent-blue-600" />
                Email me for every ticket update
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="accent-blue-600" defaultChecked />
                Show toast alerts in app
              </label>
              <label className="block mt-4">
                <span className="block mb-1 font-semibold">Notification Frequency</span>
                <select className="w-full p-2 border rounded-lg">
                  <option>Immediately</option>
                  <option>Every 15 minutes</option>
                  <option>Hourly</option>
                  <option>Daily Digest</option>
                </select>
              </label>
            </div>
          </div>
        );
      case "security":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">🔐 Security Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="password" placeholder="Current Password" className="p-3 border rounded-lg" />
              <input type="password" placeholder="New Password" className="p-3 border rounded-lg" />
              <input type="password" placeholder="Confirm New Password" className="p-3 border rounded-lg" />
              <label className="col-span-full flex items-center gap-3">
                <input type="checkbox" className="accent-blue-600" />
                Enable 2-Factor Authentication (2FA)
              </label>
              <button className="col-span-full bg-blue-600 text-white py-2 rounded-lg">Update Security Settings</button>
            </div>
          </div>
        );
      case "organization":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">🏢 Organization Settings</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Organization Name" className="p-3 border rounded-lg w-full" />
              <input type="email" placeholder="Support Contact Email" className="p-3 border rounded-lg w-full" />
              <input type="text" placeholder="SLA Duration (in hours)" className="p-3 border rounded-lg w-full" />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
            </div>
          </div>
        );
      case "roles":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">🧑‍🤝‍🧑 User Roles</h2>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg flex justify-between">
                <span>IT Admin</span>
                <button className="text-blue-600 hover:underline">Manage</button>
              </div>
              <div className="p-3 border rounded-lg flex justify-between">
                <span>Department Manager</span>
                <button className="text-blue-600 hover:underline">Manage</button>
              </div>
              <div className="p-3 border rounded-lg flex justify-between">
                <span>Staff User</span>
                <button className="text-blue-600 hover:underline">Manage</button>
              </div>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">🔌 Integrations</h2>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="font-semibold">Microsoft 365 Integration</p>
                <p className="text-sm text-gray-600">Sync Outlook, OneDrive, Teams</p>
                <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-1 rounded-lg">Connect</button>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-semibold">Slack Alerts</p>
                <p className="text-sm text-gray-600">Push ticket alerts to Slack channels</p>
                <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-1 rounded-lg">Connect</button>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-semibold">Google Calendar</p>
                <p className="text-sm text-gray-600">Sync tasks and SLAs with Google Calendar</p>
                <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-1 rounded-lg">Connect</button>
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
