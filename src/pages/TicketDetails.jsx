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
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { Dialog } from "@headlessui/react";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ comment: "", status: "" });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updatedDept, setUpdatedDept] = useState("");
  const [updatedAssignee, setUpdatedAssignee] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/tickets/${id}`);
      setTicket(res.data);
      setNotes(res.data.notes || []);
      setUpdatedDept(res.data.department);
      setUpdatedAssignee(res.data.assignedTo);
    } catch (err) {
      console.error("Failed to fetch ticket", err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [deptRes, userRes] = await Promise.all([
        API.get("/metadata/departments"),
        API.get("/metadata/users")
      ]);
      setDepartments(deptRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    }
  };

  const handleStatusChange = () => setShowModal(true);

  const confirmStatusUpdate = async () => {
    setIsUpdatingStatus(true);
    try {
      await API.patch(`/tickets/${id}`, {
        status: updatedStatus,
        department: updatedDept,
        assignedTo: updatedAssignee
      });
      await API.post(`/tickets/${id}/notes`, {
        comment: `Ticket updated with status '${updatedStatus}', department '${updatedDept}', and assigned to '${updatedAssignee}'`,
        status: updatedStatus
      });
      setShowModal(false);
      fetchTicket();
    } catch (err) {
      console.error("Failed to update ticket", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/tickets/${id}/notes`, newNote);
      setNewNote({ comment: "", status: "" });
      fetchTicket();
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await API.delete(`/tickets/${id}/notes/${noteId}`);
      fetchTicket();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchMetadata();
  }, [id]);

  if (!ticket) return <p className="text-white">Loading ticket...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-yellow-300">
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
          <label className="flex items-center gap-2 text-gray-800">
            <FiEdit3 /> <strong>Status:</strong>
            <button
              onClick={handleStatusChange}
              className="ml-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 text-sm"
            >
              {ticket.status} <FiChevronDown className="inline ml-1" />
            </button>
          </label>
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
            <FiClock /> <strong>Created At:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Invalid Date"}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <label className="flex flex-col text-gray-800">
            <span className="flex gap-2 items-center mb-1">
              <FiLayers /> <strong>Department:</strong>
            </span>
            <select
              value={updatedDept}
              onChange={(e) => setUpdatedDept(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <label className="flex flex-col text-gray-800">
            <span className="flex gap-2 items-center mb-1">
              <FiUser /> <strong>Assigned To:</strong>
            </span>
            <select
              value={updatedAssignee}
              onChange={(e) => setUpdatedAssignee(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {users
                .filter((u) => u.department === updatedDept)
                .map((user) => (
                  <option key={user.email} value={user.email}>{user.name}</option>
                ))}
            </select>
          </label>
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
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No notes yet.</p>
        )}
      </div>

      <form
        onSubmit={handleNoteSubmit}
        className="space-y-4 bg-yellow-50 p-6 rounded-2xl border border-yellow-200"
      >
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
        <button
          type="submit"
          className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold"
        >
          💬 Submit Note
        </button>
      </form>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-xl p-6 shadow-xl border border-yellow-300">
            <Dialog.Title className="text-lg font-bold mb-4 text-yellow-700">Update Ticket Details</Dialog.Title>

            <label className="block mb-3">
              <span className="block mb-1 text-sm font-medium">Select New Status</span>
              <select
                className="w-full border rounded px-3 py-2"
                value={updatedStatus || ticket.status}
                onChange={(e) => setUpdatedStatus(e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </label>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={isUpdatingStatus}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                {isUpdatingStatus ? "Saving..." : "Update Ticket"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TicketDetails;
