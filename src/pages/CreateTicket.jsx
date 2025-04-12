// src/pages/CreateTicket.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiSend,
  FiTag,
  FiFileText,
  FiUser,
  FiLayers,
  FiAlertCircle,
  FiCalendar,
  FiHash,
  FiPaperclip,
  FiShield
} from "react-icons/fi";
import toast from "react-hot-toast";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "",
    assignedTo: "",
    category: "",
    slaLevel: "",
    dueDate: "",
    tags: "",
    attachments: "",
    isInternal: false,
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
      const response = await axios.post(
        "https://ticxnova-a6e8f0cmaxguhpfm.canadacentral-01.azurewebsites.net/api/tickets",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("🎉 Ticket created successfully!");
        navigate("/all-tickets");
      }
    } catch (err) {
      console.error("❌ Ticket creation failed:", err);
      toast.error("Error creating ticket");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-10 shadow-2xl rounded-3xl">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700">
        <FiSend /> Create New Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiTag />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter ticket title"
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Priority</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiAlertCircle />
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
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
          <label className="block font-medium mb-1">Description</label>
          <div className="flex items-start gap-2 border p-2 rounded-md">
            <FiFileText className="mt-1" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue or request..."
              className="w-full bg-transparent outline-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Department & Assigned */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Department</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiLayers />
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. IT, HR, Admin"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Assign To</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiUser />
              <input
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Advanced Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Category</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiHash />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Hardware, Software, Network"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">SLA Level</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiShield />
              <input
                name="slaLevel"
                value={formData.slaLevel}
                onChange={handleChange}
                placeholder="Standard, High, Critical"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tags & Due Date */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiCalendar />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Tags</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiHash />
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="urgent, server, ui"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Attachments & Internal Note */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Attachments (links)</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiPaperclip />
              <input
                name="attachments"
                value={formData.attachments}
                onChange={handleChange}
                placeholder="e.g. file1.pdf, img.png"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              name="isInternal"
              checked={formData.isInternal}
              onChange={handleChange}
            />
            <label className="text-sm">
              Mark as <strong>Internal Note</strong> (visible to staff only)
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all"
        >
          🚀 Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
