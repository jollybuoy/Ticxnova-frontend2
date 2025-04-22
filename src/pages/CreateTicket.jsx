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
import { FiInfo } from "react-icons/fi";

const typeOptions = [
  { label: "Incident", icon: <FaBug />, color: "from-red-500 to-pink-500" },
  { label: "Service Request", icon: <HiWrenchScrewdriver />, color: "from-blue-500 to-sky-500" },
  { label: "Change Request", icon: <HiOutlineInformationCircle />, color: "from-purple-500 to-indigo-500" },
  { label: "Problem", icon: <HiOutlineLightBulb />, color: "from-orange-500 to-yellow-500" },
  { label: "Task", icon: <FaClipboardCheck />, color: "from-green-500 to-emerald-500" },
];

const fieldConfig = {
  Incident: ["title", "description", "priority", "responseETA", "resolutionETA"],
  "Service Request": ["title", "description", "requestedItem", "justification"],
  "Change Request": ["title", "description", "plannedStart", "plannedEnd"],
  Problem: ["title", "description"],
  Task: ["title", "description", "dueDate"]
};

const labels = {
  title: "Title",
  description: "Description",
  priority: "Priority",
  requestedItem: "Requested Item",
  justification: "Justification",
  plannedStart: "Planned Start Date",
  plannedEnd: "Planned End Date",
  dueDate: "Due Date",
  responseETA: "Response ETA",
  resolutionETA: "Resolution ETA"
};

const slaTimes = {
  P1: { response: 30, resolution: 6 * 60 },
  P2: { response: 60, resolution: 12 * 60 },
  P3: { response: 4 * 60, resolution: 3 * 24 * 60 },
  P4: { response: 24 * 60, resolution: 7 * 24 * 60 },
};

const CreateTicket = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(localStorage.getItem("selectedType") || "");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "P3",
    assignedTo: "",
    department: "",
    ticketType: selectedType,
    plannedStart: "",
    plannedEnd: "",
    requestedItem: "",
    justification: "",
    dueDate: "",
    responseETA: "",
    resolutionETA: ""
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);
  const [createdTicketDbId, setCreatedTicketDbId] = useState(null);

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

  useEffect(() => {
    if (selectedType === "Incident" && formData.priority && slaTimes[formData.priority]) {
      const now = new Date();
      const response = new Date(now.getTime() + slaTimes[formData.priority].response * 60000);
      const resolution = new Date(now.getTime() + slaTimes[formData.priority].resolution * 60000);
      setFormData((prev) => ({
        ...prev,
        responseETA: response.toISOString().slice(0, 16),
        resolutionETA: resolution.toISOString().slice(0, 16),
      }));
    }
  }, [formData.priority, selectedType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/tickets", formData);
      const newTicketId = res.data.ticketId;
      const newId = res.data.id;
      setCreatedTicketId(newTicketId);
      setCreatedTicketDbId(newId);
      setShowSuccessModal(true);
      localStorage.removeItem("selectedType");
    } catch (err) {
      console.error("Ticket creation failed", err);
      toast.error("❌ Failed to create ticket. Please check the required fields.");
    }
  };

  const fields = fieldConfig[selectedType] || [];
  const typeIcon = typeOptions.find((t) => t.label === selectedType)?.icon;

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
          <div key={field} className={`col-span-${field === "description" ? "2" : "1"}`}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {labels[field]}
              {field === "priority" && selectedType === "Incident" && (
                <span title="ITIL SLA: P1 - 30m/6h, P2 - 1h/12h, P3 - 4h/3d, P4 - 1d/7d" className="inline-block ml-2 text-blue-500">
                  <FiInfo className="inline" />
                </span>
              )}
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
            ) : field === "priority" ? (
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-xl shadow-sm"
                required
              >
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
                <option value="P4">P4 - Low</option>
              </select>
            ) : field === "responseETA" || field === "resolutionETA" ? (
              <input
                type="datetime-local"
                name={field}
                value={formData[field]}
                className="w-full bg-gray-100 border border-gray-300 text-gray-500 p-3 rounded-xl shadow-sm"
                readOnly
              />
            ) : (
              <input
                type={field.includes("Date") ? "date" : "text"}
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
            {users.filter((user) => user.department === formData.department).map((user) => (
              <option key={user.email} value={user.email}>{user.name} ({user.email})</option>
            ))}
          </select>
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
              onClick={() => navigate(`/ticket/${createdTicketDbId}`)}
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
