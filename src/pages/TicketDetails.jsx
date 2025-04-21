// src/pages/TicketDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import {
  FiTag,
  FiUser,
  FiLayers,
  FiAlertCircle,
  FiClock,
  FiEdit3,
  FiMessageSquare,
  FiTrash2,
} from "react-icons/fi";
import { Dialog } from "@headlessui/react";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ comment: "", status: "" });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("");

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/tickets/${id}`);
      setTicket(res.data);
      setNotes(res.data.notes || []);
      setSelectedDepartment(res.data.department || "");
      setAssignedTo(res.data.assignedTo || "");
      setStatus(res.data.status || "");
    } catch (err) {
      console.error("Failed to fetch ticket", err);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/tickets/${id}/notes`, newNote);
      setNewNote({ comment: "", status: "" });
      setShowUpdateModal(true);
      fetchTicket();
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const handleTicketUpdate = async () => {
    try {
      await API.patch(`/tickets/${id}`, {
        department: selectedDepartment,
        assignedTo,
        status,
      });
      setShowUpdateModal(false);
      fetchTicket();
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  const fetchMetadata = async () => {
    const [depRes, userRes] = await Promise.all([
      API.get("/tickets/metadata/departments"),
      API.get("/tickets/metadata/users"),
    ]);
    setDepartments(depRes.data);
    setUsers(userRes.data);
  };

  useEffect(() => {
    fetchTicket();
    fetchMetadata();
  }, [id]);

  if (!ticket) return <p className="text-white">Loading ticket...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-yellow-200">
      <h1 className="text-4xl font-bold mb-2 text-yellow-700 border-b pb-2 border-yellow-300">
        🎫 Ticket #{ticket.ticketId || ticket.id}
      </h1>
      {ticket.ticketType && (
        <p className="text-sm text-yellow-800 mb-6 font-semibold uppercase tracking-wide">
          {ticket.ticketType}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiTag /> <strong>Title:</strong> {ticket.title}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiEdit3 /> <strong>Status:</strong> {ticket.status}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 md:col-span-2">
          <p className="flex items-center gap-2 text-gray-800">
            <FiMessageSquare /> <strong>Description:</strong> {ticket.description}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiAlertCircle /> <strong>Priority:</strong> {ticket.priority}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiUser /> <strong>Created By:</strong> {ticket.createdBy || "Unknown"}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiClock /> <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiLayers /> <strong>Department:</strong> {ticket.department || "N/A"}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="flex items-center gap-2 text-gray-800">
            <FiUser /> <strong>Assigned To:</strong> {ticket.assignedTo || "Unassigned"}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-yellow-700">📝 Notes</h2>
      <div className="space-y-4 mb-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800">
                    <strong>Comment:</strong> {note.comment}
                  </p>
                  <p className="text-gray-800">
                    <strong>Status:</strong> {note.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    By {note.createdBy} on {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteNote(note.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No notes yet.</p>
        )}
      </div>

      <form onSubmit={handleNoteSubmit} className="space-y-4 bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
        <h3 className="text-xl font-bold text-yellow-700">➕ Add Note</h3>
        <textarea
          value={newNote.comment}
          onChange={(e) => setNewNote({ ...newNote, comment: e.target.value })}
          className="w-full p-3 rounded-lg bg-white focus:outline-none"
          rows={3}
          placeholder="Add your comment"
          required
        ></textarea>
        <select
          value={newNote.status}
          onChange={(e) => setNewNote({ ...newNote, status: e.target.value })}
          className="w-full p-2 rounded-lg bg-white"
          required
        >
          <option value="">Select status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
        <button type="submit" className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold">
          💬 Submit Note
        </button>
      </form>

      {/* Modal for update after note submission */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full border border-yellow-300">
            <Dialog.Title className="text-lg font-bold text-yellow-700 mb-4">🛠 Update Ticket Info</Dialog.Title>

            <div className="space-y-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 rounded border"
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2 rounded border"
              >
                <option value="">Select Department</option>
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-2 rounded border"
              >
                <option value="">Select Assignee</option>
                {users
                  .filter(u => u.department === selectedDepartment)
                  .map((user, idx) => (
                    <option key={idx} value={user.email}>{user.name}</option>
                  ))}
              </select>

              <button
                onClick={handleTicketUpdate}
                className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg"
              >
                ✅ Submit Updates
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TicketDetails;
