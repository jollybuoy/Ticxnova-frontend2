// src/pages/CreateTicket.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  Incident: ["title", "description", "priority"],
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
    plannedStart: "",
    plannedEnd: "",
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);

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
      const res = await axios.post("/tickets", formData);
      const newTicketId = res.data.ticketId || res.data.id;
      setCreatedTicketId(newTicketId);
      setShowSuccessModal(true);
      localStorage.removeItem("selectedType");
    } catch (err) {
      console.error("Ticket creation failed", err);
    }
  };

  const fields = fieldConfig[selectedType] || [];
  const typeIcon = typeOptions.find((t) => t.label === selectedType)?.icon;

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
              className={`cursor-pointer bg-gradient-to-br ${type.color} text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out`}
              title={type.label}
            >
              <div className="text-4xl mb-3 animate-pulse">{type.icon}</div>
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
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl animate-fade-in">
      <button
        onClick={() => {
          setSelectedType("");
          localStorage.removeItem("selectedType");
        }}
        className="mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Back to type selection
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="text-2xl">{typeIcon}</span> Create {selectedType} Ticket
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div
            key={field}
            className={`col-span-${field === "description" ? "2" : "1"}`}
          >
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {labels[field]}
            </label>
            {field === "description" ? (
              <textarea
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                placeholder={`Enter ${labels[field]}`}
                className="w-full bg-white border border-gray-300 text-gray-900 p-4 rounded-xl shadow-sm"
                rows={5}
                required
              ></textarea>
            ) : (
              <input
                type={field.toLowerCase().includes("date") ? "date" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                placeholder={`Enter ${labels[field]}`}
                className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-xl shadow-sm"
                required={field === "title"}
              />
            )}
          </div>
        ))}

        <div className="col-span-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-xl shadow-sm"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Assigned To</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-xl shadow-sm"
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

        <div className="col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">Attachment (Optional)</label>
          <input
            type="file"
            name="attachment"
            className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-xl shadow-sm"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md transition-all duration-300"
          >
            🚀 Submit Ticket
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
            <div className="text-5xl mb-4 animate-bounce">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">Ticket Created!</h2>
            <p className="text-gray-800 mb-4">
              {selectedType} Ticket <strong>{createdTicketId}</strong> has been successfully created.
            </p>
            <button
              onClick={() => navigate(`/ticket/${createdTicketId}`)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔍 View Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTicket;
