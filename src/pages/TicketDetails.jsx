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
  FiPaperclip,
} from "react-icons/fi";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ comment: "", status: "" });
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/tickets/${ticketid}`);
      setTicket(res.data);
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error("❌ Failed to fetch ticket", err);
      setError("Ticket not found or error loading ticket.");
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/tickets/${ticketid}/notes`, newNote);
      setNewNote({ comment: "", status: "" });
      fetchTicket();
    } catch (err) {
      console.error("❌ Error adding note", err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await API.delete(`/tickets/${ticketid}/notes/${noteId}`);
      fetchTicket();
    } catch (err) {
      console.error("❌ Failed to delete note", err);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!ticket) return <p className="text-white text-center mt-10">Loading ticket...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6 border-b pb-3 border-cyan-700">
        🎫 Ticket #{ticket.ticketId || ticket.id}
      </h1>

      <div className="grid md:grid-cols-2 gap-6 text-white">
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiTag /> <strong>Title:</strong> {ticket.title}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiEdit3 /> <strong>Status:</strong> {ticket.status}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl md:col-span-2">
          <p className="flex items-center gap-2"><FiMessageSquare /> <strong>Description:</strong> {ticket.description}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiAlertCircle /> <strong>Priority:</strong> {ticket.priority}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiUser /> <strong>Created By:</strong> {ticket.createdBy || "Unknown"}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiClock /> <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiLayers /> <strong>Department:</strong> {ticket.department || "N/A"}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2"><FiUser /> <strong>Assigned To:</strong> {ticket.assignedTo || "Unassigned"}</p>
        </div>
        {ticket.attachments && (
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-xl md:col-span-2">
            <p className="flex items-center gap-2"><FiPaperclip /> <strong>Attachments:</strong> {ticket.attachments}</p>
          </div>
        )}
      </div>

      <h2 className="text-2xl text-cyan-300 font-bold mt-10 mb-3">📝 Notes</h2>
      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="bg-slate-800 text-white p-4 rounded-xl border border-cyan-800">
              <div className="flex justify-between">
                <div>
                  <p><strong>Comment:</strong> {note.comment}</p>
                  <p><strong>Status:</strong> {note.status}</p>
                  <p className="text-sm text-gray-400">By {note.createdBy} on {new Date(note.createdAt).toLocaleString()}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notes yet.</p>
        )}
      </div>

      <form onSubmit={handleNoteSubmit} className="bg-slate-800 p-6 rounded-2xl mt-6 text-white">
        <h3 className="text-xl font-semibold text-cyan-300 mb-3">➕ Add Note</h3>
        <textarea
          value={newNote.comment}
          onChange={(e) => setNewNote({ ...newNote, comment: e.target.value })}
          className="w-full p-3 rounded-lg bg-slate-700 focus:outline-none"
          rows={3}
          placeholder="Add your comment"
          required
        ></textarea>
        <select
          value={newNote.status}
          onChange={(e) => setNewNote({ ...newNote, status: e.target.value })}
          className="w-full mt-3 p-2 rounded-lg bg-slate-700 text-white"
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
          className="w-full py-2 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-semibold"
        >
          💬 Submit Note
        </button>
      </form>
    </div>
  );
};

export default TicketDetails;
