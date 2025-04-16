// src/pages/CreateTicket.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

const fieldConfig = {
  Incident: ["title", "description", "priority", "impact", "urgency"],
  "Service Request": ["title", "description", "requestedItem", "justification"],
  "Change Request": ["title", "description", "plannedStart", "plannedEnd", "riskLevel"],
  Problem: ["title", "description", "symptoms", "rootCause"],
  Task: ["title", "description", "dueDate", "checklist"]
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
  checklist: "Checklist Items"
};

const CreateTicket = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    department: "",
    ticketType: type,
    impact: "",
    urgency: "",
    requestedItem: "",
    justification: "",
    plannedStart: "",
    plannedEnd: "",
    riskLevel: "",
    symptoms: "",
    rootCause: "",
    dueDate: "",
    checklist: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tickets", formData);
      toast.success("✅ Ticket created successfully!");
      navigate("/all-tickets");
    } catch (err) {
      console.error("Ticket creation failed", err);
      toast.error("❌ Failed to create ticket");
    }
  };

  const fields = fieldConfig[type] || [];

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">📝 Create {type} Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-slate-800 p-6 rounded-xl shadow-xl max-w-3xl mx-auto">
        {fields.map((field) => (
          <div key={field}>
            <label className="block mb-1 text-sm font-semibold text-white/80">{labels[field]}</label>
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

        {/* Common Fields */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-white/80">Assigned To (email)</label>
          <input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full bg-slate-700 text-white p-3 rounded-lg outline-none"
          />
        </div>

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
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 transition text-white font-bold py-2 rounded-lg"
        >
          ✅ Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
