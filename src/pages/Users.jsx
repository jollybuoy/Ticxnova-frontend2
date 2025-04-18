// src/pages/Users.jsx
import React, { useState } from "react";
import {
  FiUserCheck,
  FiSearch,
  FiShield,
  FiMail,
  FiUsers,
  FiBriefcase,
  FiEye,
  FiEdit,
  FiSlash
} from "react-icons/fi";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@contoso.com",
    role: "Admin",
    department: "IT",
    status: "Active",
    createdAt: "2023-11-12"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@contoso.com",
    role: "User",
    department: "Finance",
    status: "Active",
    createdAt: "2023-12-02"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@contoso.com",
    role: "Approver",
    department: "HR",
    status: "Disabled",
    createdAt: "2024-01-15"
  }
];

const Users = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const filteredUsers = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    const matchDept = deptFilter ? u.department === deptFilter : true;
    return matchSearch && matchRole && matchDept;
  });

  const allRoles = [...new Set(mockUsers.map((u) => u.role))];
  const allDepts = [...new Set(mockUsers.map((u) => u.department))];

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <div className="mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiUsers className="text-blue-600" /> Users
        </h1>
        <p className="text-sm text-gray-500">List of users in your organization (mock from Azure AD)</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-lg"
        >
          <option value="">Filter by Role</option>
          {allRoles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-lg"
        >
          <option value="">Filter by Department</option>
          {allDepts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto text-sm border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-gray-600">
            <th>#</th>
            <th><FiUserCheck className="inline mr-1" /> Name</th>
            <th><FiMail className="inline mr-1" /> Email</th>
            <th><FiShield className="inline mr-1" /> Role</th>
            <th><FiBriefcase className="inline mr-1" /> Department</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, i) => (
            <tr
              key={user.id}
              className="bg-gradient-to-br from-gray-50 to-blue-50 shadow rounded-xl text-gray-800"
            >
              <td className="p-3 font-semibold">{i + 1}</td>
              <td className="p-3 font-bold">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  user.role === "Admin"
                    ? "bg-purple-200 text-purple-700"
                    : user.role === "Approver"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-700"
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-3">{user.department}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="p-3 text-xs text-gray-500">{user.createdAt}</td>
              <td className="p-3 flex gap-2">
                <button title="View" className="text-blue-600 hover:text-blue-800">
                  <FiEye />
                </button>
                <button title="Edit" className="text-yellow-500 hover:text-yellow-700">
                  <FiEdit />
                </button>
                <button title="Disable" className="text-red-500 hover:text-red-700">
                  <FiSlash />
                </button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-400">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
