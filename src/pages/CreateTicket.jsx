// src/pages/CreateTicket.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiSend,
  FiTool,
  FiFileText,
  FiUser,
  FiLayers,
  FiAlertCircle,
  FiCalendar,
  FiHash,
  FiPaperclip,
  FiClipboard,
  FiActivity,
  FiSettings,
  FiArrowLeft,
  FiZap,
  FiCheckCircle,
  FiBox,
  FiLightbulb
} from "react-icons/fi";
import { FaBug } from "react-icons/fa"; // ✅ Replaced FiBug
import toast from "react-hot-toast";

const typeOptions = [
  { label: "Incident", icon: <FaBug />, color: "from-red-500 to-pink-500" },
  { label: "Service Request", icon: <FiTool />, color: "from-blue-500 to-sky-500" },
  { label: "Change Request", icon: <FiLightbulb />, color: "from-purple-500 to-indigo-500" },
  { label: "Problem", icon: <FiActivity />, color: "from-orange-500 to-yellow-500" },
  { label: "Task", icon: <FiClipboard />, color: "from-green-500 to-teal-500" }
];

const CreateTicket = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "",
    assignedTo: "",
    dueDate: "",
    isInternal: false,
    attachments: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://ticxnova-a6e8f0cmaxguhpfm.canadacentral-01.azurewebsites.net/api/tickets",
        { ...formData, ticketType: selectedType },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  if (!selectedType) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">What type of ticket do you want to create?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {typeOptions.map((type) => (
            <div
              key={type.label}
              onClick={() => setSelectedType(type.label)}
              className={`cursor-pointer bg-gradient-to-br ${type.color} text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-all`}
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="text-xl font-semibold">{type.label}</h3>
              <p className="text-sm opacity-80 mt-1">Click to create a {type.label.toLowerCase()} ticket</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-10 shadow-2xl rounded-3xl">
      <button onClick={() => setSelectedType("")} className="mb-6 text-gray-500 hover:text-black flex items-center gap-2">
        <FiArrowLeft /> Back to type selection
      </button>

      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700">
        <FiSend /> Create New {selectedType} Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiHash />
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

        <div className="grid md:grid-cols-2 gap-6">
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
            <label className="block font-medium mb-1">Attachments (links)</label>
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <FiPaperclip />
              <input
                name="attachments"
                value={formData.attachments}
                onChange={handleChange}
                placeholder="e.g. file1.pdf"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
