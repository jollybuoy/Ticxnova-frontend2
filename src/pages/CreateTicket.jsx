// src/pages/CreateTicket.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FaBug,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  HiWrenchScrewdriver,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
} from "react-icons/hi2";

const typeOptions = [
  { label: "Incident", icon: <FaBug />, color: "from-red-500 to-pink-500" },
  { label: "Service Request", icon: <HiWrenchScrewdriver />, color: "from-blue-500 to-sky-500" },
  { label: "Change Request", icon: <HiOutlineInformationCircle />, color: "from-purple-500 to-indigo-500" },
  { label: "Problem", icon: <HiOutlineLightBulb />, color: "from-orange-500 to-yellow-500" },
  { label: "Task", icon: <FaClipboardCheck />, color: "from-green-500 to-emerald-500" },
];

const fieldConfig = {
  Incident: ["title", "description", "priority", "impact", "urgency"],
  "Service Request": ["title", "description", "requestedItem", "justification"],
  "Change Request": ["title", "description", "plannedStart", "plannedEnd", "riskLevel"],
  Problem: ["title", "description", "symptoms", "rootCause"],
  Task: ["title", "description", "dueDate", "checklist"],
};

const labels = {
  title: "Title",
  description: "Description",
  priority: "Priority",
  impact: "Impact",
  urgency: "Urgency",
  requestedItem: "Requested Item",
  justification: "Justification",
  plannedStart: "Planned Start Date",
  plannedEnd: "Planned End Date",
  riskLevel: "Risk Level",
  symptoms: "Symptoms",
  rootCause: "Root Cause",
  dueDate: "Due Date",
  checklist: "Checklist Items",
};

const CreateTicket = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(localStorage.getItem("selectedType") || "");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    department: "",
    ticketType: selectedType,
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchMetadata = async () => {
    try {
      const [deptRes, usersRes] = await Promise.all([
        axios.get("/tickets/metadata/departments"),
        axios.get("/tickets/metadata/users"),
      ]);
      setDepartments(deptRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    }
  };

  useEffect(() => {
    if (selectedType) {
      setFormData((prev) => ({ ...prev, ticketType: selectedType }));
      localStorage.setItem("selectedType", selectedType);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tickets", formData);
      localStorage.removeItem("selectedType");
      navigate("/all-tickets");
    } catch (err) {
      console.error("Ticket creation failed", err);
    }
  };

  const fields = fieldConfig[selectedType] || [];

  if (!selectedType) {
    return (
      <div className="max-w-5xl mx-auto p-10 bg-white rounded-xl shadow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          What type of ticket do you want to create?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {typeOptions.map((type) => (
            <div
              key={type.label}
              onClick={() => setSelectedType(type.label)}
              className={`cursor-pointer bg-gradient-to-br ${type.color} text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-all`}
              title={type.label}
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="text-xl font-semibold">{type.label}</h3>
              <p className="text-sm opacity-80 mt-1">
                Click to create a {type.label.toLowerCase()} ticket
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-2xl shadow-xl">
      <button
        onClick={() => {
          setSelectedType("");
          localStorage.removeItem("selectedType");
        }}
        className="mb-4 text-white text-sm hover:underline"
      >
        ← Back to type selection
      </button>

      <h1 className="text-3xl font-bold mb-6 text-white">
        📝 Create {selectedType} Ticket
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field}>
            <label className="block mb-1 text-sm font-semibold text-white/80">
              {labels[field]}
            </label>
            <input
              type={field.toLowerCase().includes("date") ? "date" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              placeholder={`Enter ${labels[field]}`}
              className="w-full bg-slate-700 text-white p-3 rounded-lg outline-none placeholder-white/40"
              required={field === "title" || field === "description"}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-sm font-semibold text-white/80">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full bg-slate-700 text-white p-3 rounded-lg outline-none"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-white/80">Assigned To</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full bg-slate-700 text-white p-3 rounded-lg outline-none"
            required
          >
            <option value="">Select Assignee</option>
            {users
              .filter((user) => user.department === formData.department)
              .map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg"
        >
          🚀 Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
