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
  const loggedInUser = localStorage.getItem("email") || "";

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
    try {
      // Check assignment condition only for closing
      if (
        status === "Closed" &&
        loggedInUser.trim().toLowerCase() !== assignedTo.trim().toLowerCase()
      ) {
        toast.warning("Please assign the ticket to yourself before closing it.");
        return;
      }

      // Update the ticket
      await axios.patch(`/tickets/${id}`, {
        department,
        assignedTo,
        status,
        priority,
      });

      // Add note with optional file
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

      {/* rest of UI remains unchanged */}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default TicketDetails;
