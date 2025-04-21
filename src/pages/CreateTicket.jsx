// src/pages/CreateTicket.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const ticketTypes = [
  { type: "Incident", fields: ["title", "description", "priority"] },
  { type: "Service Request", fields: ["title", "description"] },
  { type: "Change Request", fields: ["title", "description", "priority", "plannedStart", "plannedEnd"] },
  { type: "Problem", fields: ["title", "description", "impact"] },
  { type: "Task", fields: ["title", "description"] },
];

const CreateTicket = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [form, setForm] = useState({});
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
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tickets", { ...form, ticketType: selectedType });
      navigate("/all-tickets");
    } catch (err) {
      console.error("Ticket creation failed", err);
    }
  };

  const fieldsToRender = ticketTypes.find((t) => t.type === selectedType)?.fields || [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      {!selectedType ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Select Ticket Type</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ticketTypes.map((t) => (
              <button
                key={t.type}
                onClick={() => setSelectedType(t.type)}
                className="bg-indigo-600 text-white p-4 rounded-lg shadow hover:bg-indigo-700"
              >
                {t.type}
              </button>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-700">📝 Create {selectedType}</h2>

          {fieldsToRender.includes("title") && (
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          )}

          {fieldsToRender.includes("description") && (
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              rows={3}
            ></textarea>
          )}

          {fieldsToRender.includes("priority") && (
            <select
              name="priority"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          )}

          {fieldsToRender.includes("impact") && (
            <select
              name="impact"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          )}

          {fieldsToRender.includes("plannedStart") && (
            <input
              type="datetime-local"
              name="plannedStart"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          )}

          {fieldsToRender.includes("plannedEnd") && (
            <input
              type="datetime-local"
              name="plannedEnd"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          )}

          <select
            name="department"
            onChange={handleChange}
            value={form.department || ""}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            name="assignedTo"
            onChange={handleChange}
            value={form.assignedTo || ""}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Assignee</option>
            {users
              .filter((user) => user.department === form.department)
              .map((user) => (
                <option key={user.email} value={user.email}>{user.name} ({user.email})</option>
              ))}
          </select>

          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
              ✅ Create Ticket
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("")}
              className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
            >
              🔙 Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateTicket;
