import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";
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
  FiCalendar,
  FiFileText,
  FiSave,
  FiArrowLeft,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiTrendingUp,
  FiBarChart3,
  FiTarget,
  FiUsers,
  FiBuilding,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe
} from "react-icons/fi";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ comment: "" });
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const loggedInUser = localStorage.getItem("email") || "";

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (!newNote.comment.trim()) return;
    setShowUpdateBox(true);
  };

  const handleTicketUpdate = async () => {
    setIsSubmitting(true);
    try {
      let updateData = { status, department, assignedTo, priority };

      if (status === "Closed") {
        updateData.assignedTo = loggedInUser;
        const userMatch = users.find((u) => u.email === loggedInUser);
        if (userMatch) {
          updateData.department = userMatch.department;
        }
      }

      await axios.patch(`/tickets/${id}`, updateData);
      await axios.post(`/tickets/${id}/notes`, {
        comment: newNote.comment,
        status,
      });

      setNewNote({ comment: "" });
      setShowUpdateBox(false);
      fetchTicket();
    } catch (err) {
      console.error("Error updating ticket", err);
    } finally {
      setIsSubmitting(false);
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

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-500 text-white";
      case "In Progress": return "bg-yellow-500 text-black";
      case "Completed": return "bg-green-500 text-white";
      case "Closed": return "bg-gray-500 text-white";
      default: return "bg-gray-300 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "P1": return "bg-red-500 text-white";
      case "P2": return "bg-orange-500 text-white";
      case "P3": return "bg-yellow-500 text-black";
      case "P4": return "bg-green-500 text-white";
      default: return "bg-gray-300 text-gray-700";
    }
  };

  const tabs = [
    { id: "details", label: "Details", icon: <FiFileText /> },
    { id: "activity", label: "Activity", icon: <FiActivity /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart3 /> }
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-8'} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'} mb-8`}
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/all-tickets")}
              className={`${isMobile ? 'p-2' : 'p-3'} rounded-xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors`}
            >
              <FiArrowLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </motion.button>
            
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-800 flex items-center gap-3`}>
                <div className={`${isMobile ? 'text-2xl p-2' : 'text-3xl p-3'} rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg`}>
                  🎫
                </div>
                {ticket.ticketId}
              </h1>
              <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-600 mt-1`}>
                {ticket.ticketType} • Created {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status & Priority Badges */}
          <div className={`flex ${isMobile ? 'justify-center' : ''} gap-3`}>
            <span className={`${isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'} font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
            <span className={`${isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'} font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-4'} mb-8`}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`${isMobile ? 'w-full' : ''} flex items-center gap-2 ${isMobile ? 'px-4 py-3' : 'px-6 py-3'} rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-lg border-2 border-blue-200'
                  : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow-md border-2 border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Ticket Information Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
                  <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 flex items-center gap-2`}>
                    <FiFileText className="text-blue-500" />
                    Ticket Information
                  </h2>
                </div>

                <div className={`${isMobile ? 'p-4' : 'p-8'} grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-8'}`}>
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div>
                      <label className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 flex items-center gap-2 mb-2`}>
                        <FiTag className="text-blue-500" />
                        Title
                      </label>
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200`}>
                        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 font-medium`}>{ticket.title}</p>
                      </div>
                    </div>

                    <div>
                      <label className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 flex items-center gap-2 mb-2`}>
                        <FiMessageSquare className="text-green-500" />
                        Description
                      </label>
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200`}>
                        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 leading-relaxed`}>{ticket.description}</p>
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-4`}>
                      <div>
                        <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 flex items-center gap-1 mb-2`}>
                          <FiAlertCircle className="text-orange-500" />
                          Priority
                        </label>
                        <div className={`${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg border border-gray-200`}>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${getPriorityColor(ticket.priority)} px-2 py-1 rounded-full`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 flex items-center gap-1 mb-2`}>
                          <FiEdit3 className="text-purple-500" />
                          Status
                        </label>
                        <div className={`${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg border border-gray-200`}>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${getStatusColor(ticket.status)} px-2 py-1 rounded-full`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment & Dates */}
                  <div className="space-y-6">
                    <div>
                      <label className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 flex items-center gap-2 mb-2`}>
                        <FiUser className="text-purple-500" />
                        Assignment Details
                      </label>
                      <div className="space-y-3">
                        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200`}>
                          <div className="flex items-center gap-2 mb-2">
                            <FiBuilding className="text-blue-500" />
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Department</span>
                          </div>
                          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 font-medium`}>{ticket.department}</p>
                        </div>
                        
                        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200`}>
                          <div className="flex items-center gap-2 mb-2">
                            <FiUser className="text-green-500" />
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Assigned To</span>
                          </div>
                          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 font-medium`}>{ticket.assignedTo || "Unassigned"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 flex items-center gap-2 mb-2`}>
                        <FiClock className="text-orange-500" />
                        Timeline
                      </label>
                      <div className="space-y-3">
                        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200`}>
                          <div className="flex items-center gap-2 mb-2">
                            <FiCalendar className="text-blue-500" />
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Created</span>
                          </div>
                          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 font-medium`}>
                            {new Date(ticket.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200`}>
                          <div className="flex items-center gap-2 mb-2">
                            <FiUser className="text-purple-500" />
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Created By</span>
                          </div>
                          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 font-medium`}>{ticket.createdBy || "Unknown"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200 p-6">
                  <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 flex items-center gap-2`}>
                    <FiMessageSquare className="text-green-500" />
                    Activity & Notes ({notes.length})
                  </h2>
                </div>

                <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                  {notes.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiUser className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800`}>
                                  {note.createdBy}
                                </p>
                                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                                  {new Date(note.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="mb-3">
                            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 leading-relaxed`}>
                              {note.comment}
                            </p>
                          </div>
                          
                          {note.status && (
                            <div className="flex items-center gap-2">
                              <FiActivity className="w-4 h-4 text-blue-500" />
                              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                                Status changed to: <span className="font-semibold">{note.status}</span>
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No notes yet. Add the first note to start tracking activity.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 p-6">
                <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 flex items-center gap-2`}>
                  <FiActivity className="text-purple-500" />
                  Activity Timeline
                </h2>
              </div>

              <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                <div className="space-y-6">
                  {/* Timeline Items */}
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiCheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800`}>Ticket Created</p>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                            {new Date(ticket.createdAt).toLocaleString()}
                          </p>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>
                            Created by {ticket.createdBy}
                          </p>
                        </div>
                      </div>

                      {notes.map((note, index) => (
                        <div key={note.id} className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiMessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800`}>
                              Note Added {note.status && `• Status: ${note.status}`}
                            </p>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                              {new Date(note.createdAt).toLocaleString()}
                            </p>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>
                              By {note.createdBy}
                            </p>
                            <div className={`mt-2 ${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg`}>
                              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700`}>{note.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Analytics Cards */}
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                {[
                  { title: "Time Open", value: "2.5 days", icon: <FiClock />, color: "from-blue-500 to-blue-600" },
                  { title: "SLA Status", value: "On Track", icon: <FiTarget />, color: "from-green-500 to-green-600" },
                  { title: "Priority Level", value: ticket.priority, icon: <FiAlertCircle />, color: "from-orange-500 to-orange-600" },
                  { title: "Department", value: ticket.department, icon: <FiBuilding />, color: "from-purple-500 to-purple-600" }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r ${metric.color} rounded-2xl text-white shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} opacity-80`}>
                        {metric.icon}
                      </div>
                    </div>
                    <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold opacity-90 mb-2`}>{metric.title}</h3>
                    <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{metric.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 p-6">
                  <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 flex items-center gap-2`}>
                    <FiTrendingUp className="text-indigo-500" />
                    Performance Metrics
                  </h2>
                </div>

                <div className={`${isMobile ? 'p-4' : 'p-8'} grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-8'}`}>
                  <div>
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-800 mb-4`}>Response Times</h3>
                    <div className="space-y-3">
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl`}>
                        <div className="flex justify-between items-center">
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>First Response</span>
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-green-600`}>15 min</span>
                        </div>
                      </div>
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl`}>
                        <div className="flex justify-between items-center">
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>Average Response</span>
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-blue-600`}>2.5 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-800 mb-4`}>SLA Compliance</h3>
                    <div className="space-y-3">
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl`}>
                        <div className="flex justify-between items-center">
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>Response SLA</span>
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-green-600`}>Met</span>
                        </div>
                      </div>
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl`}>
                        <div className="flex justify-between items-center">
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>Resolution SLA</span>
                          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-yellow-600`}>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Add Note Button */}
        {ticket.status !== "Closed" && (
          <Draggable handle=".drag-handle">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className={`fixed ${isMobile ? 'bottom-4 right-4 left-4' : 'bottom-8 right-8'} bg-white border-2 border-blue-200 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl shadow-2xl ${isMobile ? 'w-auto' : 'w-96'} z-50`}
            >
              <div className="drag-handle cursor-move mb-4 flex items-center justify-between">
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 flex items-center gap-2`}>
                  <FiMessageSquare className="text-blue-500" />
                  Add Note
                </h3>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              
              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <textarea
                  value={newNote.comment}
                  onChange={(e) => setNewNote({ ...newNote, comment: e.target.value })}
                  className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none`}
                  rows={isMobile ? 3 : 4}
                  placeholder="Add your comment or update..."
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiSave className="w-5 h-5" />
                  Add Note & Update
                </motion.button>
              </form>
            </motion.div>
          </Draggable>
        )}

        {/* Update Modal */}
        <AnimatePresence>
          {showUpdateBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className={`bg-white rounded-3xl shadow-2xl ${isMobile ? 'w-full max-w-md' : 'max-w-2xl w-full'} max-h-[90vh] overflow-y-auto`}
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
                  <div className="flex justify-between items-center">
                    <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 flex items-center gap-2`}>
                      <FiEdit3 className="text-blue-500" />
                      Update Ticket
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowUpdateBox(false)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                <div className={`${isMobile ? 'p-4' : 'p-8'} space-y-6`}>
                  <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
                    <div>
                      <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors`}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors`}
                      >
                        <option value="">Select Priority</option>
                        <option value="P1">P1 - Critical</option>
                        <option value="P2">P2 - High</option>
                        <option value="P3">P3 - Medium</option>
                        <option value="P4">P4 - Low</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                        Assigned To
                      </label>
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors`}
                      >
                        <option value="">Select Assignee</option>
                        {users
                          .filter((u) => u.department === department)
                          .map((u) => (
                            <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUpdateBox(false)}
                      className={`${isMobile ? 'flex-1' : ''} px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors`}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTicketUpdate}
                      disabled={isSubmitting}
                      className={`${isMobile ? 'flex-1' : ''} px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-5 h-5" />
                          Update Ticket
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TicketDetails;