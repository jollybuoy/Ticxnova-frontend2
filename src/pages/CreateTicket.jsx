// src/pages/CreateTicket.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSend, FiTag, FiFileText, FiUser, FiLayers, FiAlertCircle, FiHash, FiPaperclip } from "react-icons/fi";
import toast from "react-hot-toast";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "",
    assignedTo: "",
    ticketType: "Incident", // New field
    attachments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        toast.success("✅ Ticket created successfully!");
        navigate("/all-tickets");
      }
    } catch (err) {
      console.error("❌ Ticket creation failed:", err);
      toast.error("Something went wrong while creating the ticket.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 shadow-2xl rounded-3xl">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700">
        <FiSend /> Create New Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title & Type */}
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
            <label className="block font-medium mb-1">Ticket Type</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiHash />
              <select
                name="ticketType"
                value={formData.ticketType}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              >
                <option value="Incident">Incident</option>
                <option value="Service Request">Service Request</option>
                <option value="Change Request">Change Request</option>
                <option value="Problem">Problem</option>
                <option value="Task">Task</option>
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

        {/* Priority & Department */}
        <div className="grid md:grid-cols-2 gap-6">
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

          <div>
            <label className="block font-medium mb-1">Department</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiLayers />
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. IT, HR"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Assigned To & Attachments */}
        <div className="grid md:grid-cols-2 gap-6">
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

          <div>
            <label className="block font-medium mb-1">Attachments (Link)</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiPaperclip />
              <input
                name="attachments"
                value={formData.attachments}
                onChange={handleChange}
                placeholder="e.g. http://link.com/file.pdf"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
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
