// src/pages/TicketDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Draggable from "react-draggable";
import {
  FiTag,
  FiUser,
  FiLayers,
  FiAlertCircle,
  FiClock,
  FiEdit3,
  FiMessageSquare,
  FiTrash2,
  FiX,
  FiDownload
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ comment: "", file: null });
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const loggedInUser = (localStorage.getItem("email") || "").trim().toLowerCase();

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`/tickets/${id}`);
      setTicket(res.data);
      setNotes(res.data.notes || []);
      setDepartment(res.data.department || "");
      setAssignedTo(res.data.assignedTo || "");
      setPriority(res.data.priority || "");
      setStatus(res.data.status || "");
    } catch (err) {
      console.error("Failed to fetch ticket", err);
    }
  };

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

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    setShowUpdateBox(true);
  };

  const handleTicketUpdate = async () => {
    const assignedEmail = (assignedTo.match(/\(([^)]+)\)/) || [])[1] || assignedTo;
    const selectedUser = users.find(u => u.email === loggedInUser);

    const updateData = {
      status,
      priority,
      assignedTo: assignedEmail,
      department
    };

    if (status === "Closed") {
      updateData.assignedTo = loggedInUser;
      updateData.department = selectedUser?.department || "";
    }

    try {
      await axios.patch(`/tickets/${id}`, updateData);

      const formData = new FormData();
      formData.append("comment", newNote.comment);
      formData.append("status", status);
      if (newNote.file) {
        formData.append("file", newNote.file);
      }

      await axios.post(`/tickets/${id}/notes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Ticket updated and note added successfully");
      setShowUpdateBox(false);
      setNewNote({ comment: "", file: null });
      fetchTicket();
    } catch (err) {
      console.error("❌ Error updating ticket", err);
      toast.error("❌ Ticket update failed");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`/tickets/${id}/notes/${noteId}`);
      fetchTicket();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchMetadata();
  }, [id]);

  if (!ticket) return <p className="text-gray-700 p-6">Loading ticket...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2">
        🎫 Ticket #{ticket.ticketId}
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiTag /> <strong>Title:</strong> {ticket.title}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiEdit3 /> <strong>Status:</strong> {ticket.status}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border md:col-span-2">
          <p className="flex items-center gap-2 text-gray-800"><FiMessageSquare /> <strong>Description:</strong> {ticket.description}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiAlertCircle /> <strong>Priority:</strong> {ticket.priority}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiUser /> <strong>Created By:</strong> {ticket.createdBy}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiClock /> <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiLayers /> <strong>Department:</strong> {ticket.department}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="flex items-center gap-2 text-gray-800"><FiUser /> <strong>Assigned To:</strong> {ticket.assignedTo}</p>
        </div>
      </div>

      {ticket.status !== "Closed" && (
        <Draggable handle=".drag-handle">
          <div className="fixed bottom-5 right-5 bg-white border border-indigo-200 p-6 rounded-xl shadow-xl w-[350px] z-50 cursor-move">
            <div className="drag-handle cursor-move mb-3">
              <h3 className="text-xl font-bold text-indigo-700">➕ Add Note</h3>
            </div>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <textarea
                value={newNote.comment}
                onChange={(e) => setNewNote({ ...newNote, comment: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300"
                rows={3}
                placeholder="Add your comment"
                required
              ></textarea>
              <input
                type="file"
                onChange={(e) => setNewNote({ ...newNote, file: e.target.files[0] })}
                className="w-full text-sm"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
              >
                💬 Submit Note
              </button>
            </form>
          </div>
        </Draggable>
      )}

      {showUpdateBox && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-white z-40 border border-indigo-300 p-6 rounded-xl shadow-2xl max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-indigo-700">🔄 Update Ticket Info</h3>
            <button onClick={() => setShowUpdateBox(false)} className="text-gray-500 hover:text-red-500">
              <FiX size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded-lg border border-gray-300 bg-white">
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 rounded-lg border border-gray-300 bg-white">
              <option value="">Select Priority</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="p-2 rounded-lg border border-gray-300 bg-white">
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="p-2 rounded-lg border border-gray-300 bg-white">
              <option value="">Select Assigned User</option>
              {users.filter((u) => u.department === department).map((u) => (
                <option key={u.email} value={`${u.name} (${u.email})`}>{u.name} ({u.email})</option>
              ))}
            </select>
            <button
              onClick={handleTicketUpdate}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
            >
              ✅ Submit Ticket Update
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default TicketDetails;
