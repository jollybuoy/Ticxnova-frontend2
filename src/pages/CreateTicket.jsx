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
  responseETA: "Response ETA (UTC)",
  resolutionETA: "Resolution ETA (UTC)"
};

const slaTimes = {
  P1: { response: 30, resolution: 6 * 60 },
  P2: { response: 60, resolution: 12 * 60 },
  P3: { response: 4 * 60, resolution: 3 * 24 * 60 },
  P4: { response: 24 * 60, resolution: 7 * 24 * 60 },
};

const formatToLocal = (date) => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const CreateTicket = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "P3",
    assignedTo: "",
    department: "",
    ticketType: "",
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
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (selectedType === "Incident" && formData.priority && slaTimes[formData.priority]) {
      const now = new Date();
      const response = new Date(now.getTime() + slaTimes[formData.priority].response * 60000);
      const resolution = new Date(now.getTime() + slaTimes[formData.priority].resolution * 60000);
      setFormData((prev) => ({
        ...prev,
        responseETA: formatToLocal(response),
        resolutionETA: formatToLocal(resolution),
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
      const res = await axios.post("/tickets", { ...formData, ticketType: selectedType });
      const newTicketId = res.data.ticketId;
      const newId = res.data.id;
      setCreatedTicketId(newTicketId);
      setCreatedTicketDbId(newId);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Ticket creation failed", err);
      toast.error("❌ Failed to create ticket. Please check the required fields.");
    }
  };

  const fields = fieldConfig[selectedType] || [];
  const typeIcon = typeOptions.find((t) => t.label === selectedType)?.icon;

  if (!selectedType) {
    return (
      <div className="max-w-5xl mx-auto p-10 bg-white rounded-xl shadow animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          What type of ticket do you want to create?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {typeOptions.map((type) => (
            <div
              key={type.label}
              onClick={() => {
                setSelectedType(type.label);
                setFormData((prev) => ({ ...prev, ticketType: type.label }));
              }}
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
