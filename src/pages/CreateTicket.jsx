// src/pages/CreateTicket.jsx
import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiSend, FiTag, FiFileText, FiUser, FiLayers, FiAlertCircle,
  FiCalendar, FiPaperclip, FiList
} from "react-icons/fi";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "",
    assignedTo: "",
    ticketType: "Incident",
    dueDate: "",
    attachments: "",
    isInternal: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("/tickets", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        toast.success("🎉 Ticket created successfully!");
        navigate("/all-tickets");
      }
    } catch (err) {
      console.error("❌ Ticket creation failed:", err);
      toast.error("Error creating ticket");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-3xl">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700">
        <FiSend /> Create Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Priority */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiTag />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter ticket title"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Priority</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiAlertCircle />
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <div className="flex items-start gap-2 border p-2 rounded-md">
            <FiFileText className="mt-1" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue"
              className="w-full outline-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Department & Assigned To */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold">Department</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiLayers />
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. IT"
                className="w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Assign To</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiUser />
              <input
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Username or email"
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Type & Due Date */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold">Ticket Type</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiList />
              <select
                name="ticketType"
                value={formData.ticketType}
                onChange={handleChange}
                className="w-full outline-none"
              >
                <option value="Incident">Incident</option>
                <option value="Service Request">Service Request</option>
                <option value="Change Request">Change Request</option>
                <option value="Problem">Problem</option>
                <option value="Task">Task</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Due Date</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiCalendar />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Attachments & Internal Note */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold">Attachments</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiPaperclip />
              <input
                name="attachments"
                value={formData.attachments}
                onChange={handleChange}
                placeholder="link or file name"
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <input
              type="checkbox"
              name="isInternal"
              checked={formData.isInternal}
              onChange={handleChange}
            />
            <label className="text-sm">Mark as <strong>Internal</strong> (visible to staff only)</label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg"
        >
          🚀 Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
