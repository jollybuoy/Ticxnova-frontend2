// src/pages/Settings.jsx
import React, { useState } from "react";
import {
  FiUser,
  FiBell,
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
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow border">
              <h3 className="text-xl font-bold text-blue-800 mb-2">👤 Active Directory Profile</h3>
              <p className="text-sm text-gray-500 mb-4">This information is auto-fetched from Microsoft Entra ID.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div><strong>Full Name:</strong> John Doe</div>
                <div><strong>Email:</strong> john.doe@contoso.com</div>
                <div><strong>Department:</strong> IT</div>
                <div><strong>Title:</strong> Systems Administrator</div>
                <div><strong>Location:</strong> Toronto, ON</div>
              </div>
            </div>
          </div>
        );

      case "organization":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow border">
              <h3 className="text-xl font-bold text-blue-800 mb-2">🏢 Organization Profile</h3>
              <p className="text-sm text-gray-500 mb-4">This organization is synced from your Azure tenant. Changes are restricted.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div><strong>Org Name:</strong> Contoso Corporation</div>
                <div><strong>Domain:</strong> contoso.com</div>
                <div><strong>Time Zone:</strong> America/Toronto</div>
                <div><strong>Support Contact:</strong> support@contoso.com</div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="bg-white p-6 rounded-xl shadow border space-y-4">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🔔 Notification Preferences</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" defaultChecked />
              Enable desktop notifications
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" />
              Email me on ticket updates
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" defaultChecked />
              Show toast alerts in app
            </label>
            <div>
              <label className="block mb-1 font-semibold">Notification Frequency</label>
              <select className="p-2 border rounded-lg w-full">
                <option>Immediately</option>
                <option>Hourly</option>
                <option>Daily Digest</option>
              </select>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="bg-white p-6 rounded-xl shadow border space-y-4">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🔐 Security Settings</h3>
            <input type="password" placeholder="Current Password" className="p-3 border rounded-lg w-full" />
            <input type="password" placeholder="New Password" className="p-3 border rounded-lg w-full" />
            <input type="password" placeholder="Confirm New Password" className="p-3 border rounded-lg w-full" />
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" /> Enable 2FA (Two-Factor Authentication)
            </label>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg">Update Password</button>
          </div>
        );

      case "roles":
        return (
          <div className="bg-white p-6 rounded-xl shadow border space-y-4">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🧑‍🤝‍🧑 Role & Access</h3>
            <p className="text-gray-600">Role-based access control is coming soon. You’ll be able to assign roles to users like:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>IT Admin – Full Access</li>
              <li>Department Manager – View/Create tickets in dept</li>
              <li>Staff User – View own tickets only</li>
            </ul>
          </div>
        );

      case "integrations":
        return (
          <div className="bg-white p-6 rounded-xl shadow border space-y-4">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🔌 Integrations</h3>
            <div className="space-y-3">
              <div className="border p-3 rounded-lg">
                <p className="font-semibold">Microsoft 365</p>
                <p className="text-sm text-gray-600">Outlook, OneDrive, Teams integration</p>
                <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-1 rounded">Connect</button>
              </div>
              <div className="border p-3 rounded-lg">
                <p className="font-semibold">Slack Alerts</p>
                <p className="text-sm text-gray-600">Push ticket alerts to Slack</p>
                <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-1 rounded">Connect</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">⚙️ Settings</h1>
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
              }`}
            >
              {tab.icon} <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;
