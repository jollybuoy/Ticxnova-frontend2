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
  const loggedInUser = localStorage.getItem("email");

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
    if (
      status === "Closed" &&
      loggedInUser?.trim().toLowerCase() !== assignedTo?.trim().toLowerCase()
    ) {
      toast.warning("Please assign the ticket to yourself before closing it.");
      return;
    }

    try {
      await axios.patch(`/tickets/${id}`, {
        department,
        assignedTo,
        status,
        priority,
      });

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

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">📝 Notes</h2>
      <div className="space-y-4 mb-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-gray-50 p-4 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800"><strong>Comment:</strong> {note.comment}</p>
                  <p className="text-gray-800"><strong>Status:</strong> {note.status}</p>
                  {note.fileUrl && (
                    <p className="text-gray-800 flex items-center gap-2">
                      <strong>Attachment:</strong>
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline flex items-center gap-1"
                      >
                        <FiDownload /> Download
                      </a>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">By {note.createdBy} on {new Date(note.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No notes yet.</p>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default TicketDetails;
