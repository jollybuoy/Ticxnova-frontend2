// src/pages/CreateTicket.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FiTag,
  FiLayers,
  FiUser,
  FiEdit,
  FiClock,
  FiPlus,
} from "react-icons/fi";

const CreateTicket = ({ user }) => {
  const navigate = useNavigate();
  const [ticketType, setTicketType] = useState("Incident");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [department, setDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
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
      console.error("Metadata fetch failed", err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tickets", {
        ticketType,
        title,
        description,
        priority,
        department,
        assignedTo,
      });
      navigate("/all-tickets");
    } catch (err) {
      console.error("Ticket creation failed", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">➕ Create New Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Ticket Type</label>
          <select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="Incident">Incident</option>
            <option value="Service Request">Service Request</option>
            <option value="Change Request">Change Request</option>
            <option value="Problem">Problem</option>
            <option value="Task">Task</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          ></textarea>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Assign To</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select User</option>
            {users
              .filter((u) => u.department === department)
              .map((u) => (
                <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          🚀 Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
