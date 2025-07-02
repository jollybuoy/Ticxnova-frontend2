import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBug,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  HiWrenchScrewdriver,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
} from "react-icons/hi2";
import { 
  FiInfo, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiBuilding, 
  FiAlertTriangle,
  FiFileText,
  FiSave,
  FiArrowLeft,
  FiCheck,
  FiX
} from "react-icons/fi";

const typeOptions = [
  { 
    label: "Incident", 
    icon: <FaBug />, 
    color: "from-red-500 to-pink-500",
    description: "Unplanned interruption or reduction in quality of service",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  { 
    label: "Service Request", 
    icon: <HiWrenchScrewdriver />, 
    color: "from-blue-500 to-sky-500",
    description: "Request for information, advice, or standard change",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    label: "Change Request", 
    icon: <HiOutlineInformationCircle />, 
    color: "from-purple-500 to-indigo-500",
    description: "Request to add, modify, or remove service components",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    label: "Problem", 
    icon: <HiOutlineLightBulb />, 
    color: "from-orange-500 to-yellow-500",
    description: "Root cause of one or more incidents",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    label: "Task", 
    icon: <FaClipboardCheck />, 
    color: "from-green-500 to-emerald-500",
    description: "Work item that needs to be completed",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
];

const fieldConfig = {
  Incident: ["title", "description", "priority", "responseETA", "resolutionETA"],
  "Service Request": ["title", "description", "requestedItem", "justification"],
  "Change Request": ["title", "description", "plannedStart", "plannedEnd"],
  Problem: ["title", "description"],
  Task: ["title", "description", "dueDate"]
};

const labels = {
  title: "Title",
  description: "Description",
  priority: "Priority",
  requestedItem: "Requested Item",
  justification: "Justification",
  plannedStart: "Planned Start Date",
  plannedEnd: "Planned End Date",
  dueDate: "Due Date",
  responseETA: "Response ETA (Local Time)",
  resolutionETA: "Resolution ETA (Local Time)"
};

const priorityOptions = [
  { value: "P1", label: "P1 - Critical", color: "text-red-600", bgColor: "bg-red-50", description: "System down, business stopped" },
  { value: "P2", label: "P2 - High", color: "text-orange-600", bgColor: "bg-orange-50", description: "Major functionality affected" },
  { value: "P3", label: "P3 - Medium", color: "text-yellow-600", bgColor: "bg-yellow-50", description: "Minor functionality affected" },
  { value: "P4", label: "P4 - Low", color: "text-green-600", bgColor: "bg-green-50", description: "Enhancement or documentation" },
];

const slaTimes = {
  P1: { response: 30, resolution: 6 * 60 },
  P2: { response: 60, resolution: 12 * 60 },
  P3: { response: 4 * 60, resolution: 3 * 24 * 60 },
  P4: { response: 24 * 60, resolution: 7 * 24 * 60 },
};

const formatToLocal = (date) => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const CreateTicket = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "P3",
    assignedTo: "",
    department: "",
    ticketType: "",
    plannedStart: "",
    plannedEnd: "",
    requestedItem: "",
    justification: "",
    dueDate: "",
    responseETA: "",
    resolutionETA: ""
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);
  const [createdTicketDbId, setCreatedTicketDbId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    if (selectedType === "Incident" && formData.priority && slaTimes[formData.priority]) {
      const now = new Date();
      const response = new Date(now.getTime() + slaTimes[formData.priority].response * 60000);
      const resolution = new Date(now.getTime() + slaTimes[formData.priority].resolution * 60000);
      setFormData((prev) => ({
        ...prev,
        responseETA: formatToLocal(response),
        resolutionETA: formatToLocal(resolution),
      }));
    }
  }, [formData.priority, selectedType]);

  const validateForm = () => {
    const errors = {};
    const fields = fieldConfig[selectedType] || [];
    
    fields.forEach(field => {
      if (field === "title" && !formData[field]?.trim()) {
        errors[field] = "Title is required";
      }
      if (field === "description" && !formData[field]?.trim()) {
        errors[field] = "Description is required";
      }
    });

    if (!formData.department) {
      errors.department = "Department is required";
    }
    if (!formData.assignedTo) {
      errors.assignedTo = "Assignee is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await axios.post("/tickets", { ...formData, ticketType: selectedType });
      const newTicketId = res.data.ticketId;
      const newId = res.data.id;
      setCreatedTicketId(newTicketId);
      setCreatedTicketDbId(newId);
      setShowSuccessModal(true);
      toast.success("Ticket created successfully!");
    } catch (err) {
      console.error("Ticket creation failed", err);
      toast.error("❌ Failed to create ticket. Please check the required fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = fieldConfig[selectedType] || [];
  const selectedTypeData = typeOptions.find((t) => t.label === selectedType);

  // Type Selection Screen
  if (!selectedType) {
    return (
      <div className={`${isMobile ? 'p-4' : 'p-10'} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-gray-800 mb-4`}
            >
              🎫 Create New Ticket
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-600 max-w-2xl mx-auto`}
            >
              Select the type of ticket you want to create. Each type has specific fields and workflows designed for optimal resolution.
            </motion.p>
          </div>

          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
            {typeOptions.map((type, index) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedType(type.label);
                  setFormData((prev) => ({ ...prev, ticketType: type.label }));
                }}
                className={`cursor-pointer ${type.bgColor} ${type.borderColor} border-2 ${isMobile ? 'p-4' : 'p-8'} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-current rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-current rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10">
                  <div className={`${isMobile ? 'text-3xl mb-3' : 'text-5xl mb-6'} transform group-hover:scale-110 transition-transform duration-300`}>
                    {type.icon}
                  </div>
                  
                  <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 mb-3 group-hover:text-gray-900`}>
                    {type.label}
                  </h3>
                  
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 leading-relaxed group-hover:text-gray-700`}>
                    {type.description}
                  </p>

                  <div className={`mt-6 flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                    <span>Click to create</span>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="text-lg"
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-16 grid grid-cols-2 ${isMobile ? 'gap-4' : 'md:grid-cols-4 gap-8'} text-center`}
          >
            {[
              { label: "Average Resolution", value: "2.5 days", icon: "⏱️" },
              { label: "SLA Compliance", value: "98.5%", icon: "🎯" },
              { label: "Customer Satisfaction", value: "4.8/5", icon: "⭐" },
              { label: "Active Tickets", value: "156", icon: "📊" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`${isMobile ? 'p-3' : 'p-6'} bg-white rounded-2xl shadow-lg border border-gray-100`}
              >
                <div className={`${isMobile ? 'text-xl mb-1' : 'text-3xl mb-2'}`}>{stat.icon}</div>
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800`}>{stat.value}</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Advanced Form Screen
  return (
    <div className={`${isMobile ? 'p-4' : 'p-8'} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'} mb-8`}>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedType("")}
              className={`${isMobile ? 'p-2' : 'p-3'} rounded-xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors`}
            >
              <FiArrowLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </motion.button>
            
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-800 flex items-center gap-3`}>
                <div className={`${isMobile ? 'text-2xl p-2' : 'text-3xl p-3'} rounded-xl bg-gradient-to-r ${selectedTypeData?.color} text-white shadow-lg`}>
                  {selectedTypeData?.icon}
                </div>
                Create {selectedType}
              </h1>
              <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-600 mt-2`}>
                {selectedTypeData?.description}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>Form Active</span>
            </div>
          </div>
        </div>

        {/* Advanced Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Form Header */}
          <div className={`${selectedTypeData?.bgColor} ${selectedTypeData?.borderColor} border-b-2 ${isMobile ? 'p-4' : 'p-8'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800`}>Ticket Information</h2>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
                  Please fill in all required fields marked with *
                </p>
              </div>
              <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} opacity-60`}>
                {selectedTypeData?.icon}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`${isMobile ? 'p-4' : 'p-8'} space-y-8`}>
            {/* Basic Information Section */}
            <div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 mb-6 flex items-center gap-2`}>
                <FiFileText className="text-blue-500" />
                Basic Information
              </h3>
              
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-8'}`}>
                {/* Title Field */}
                {fields.includes("title") && (
                  <div className={`${fields.includes("description") ? 'lg:col-span-2' : ''}`}>
                    <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                      <span className="flex items-center gap-2">
                        <FiFileText className="text-blue-500" />
                        {labels.title} *
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a clear, descriptive title"
                      className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 ${
                        validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                      } focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500`}
                      required
                    />
                    {validationErrors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                      >
                        <FiX className="w-4 h-4" />
                        {validationErrors.title}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Description Field */}
                {fields.includes("description") && (
                  <div className="lg:col-span-2">
                    <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                      <span className="flex items-center gap-2">
                        <FiFileText className="text-blue-500" />
                        {labels.description} *
                      </span>
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide detailed information about the request..."
                      className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 ${
                        validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                      } focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none`}
                      rows={isMobile ? 4 : 6}
                      required
                    />
                    {validationErrors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                      >
                        <FiX className="w-4 h-4" />
                        {validationErrors.description}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Priority Field for Incidents */}
                {fields.includes("priority") && (
                  <div>
                    <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                      <span className="flex items-center gap-2">
                        <FiAlertTriangle className="text-orange-500" />
                        {labels.priority}
                        <div className="group relative">
                          <FiInfo className="w-4 h-4 text-blue-500 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            ITIL SLA: P1-30m/6h, P2-1h/12h, P3-4h/3d, P4-1d/7d
                          </div>
                        </div>
                      </span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {priorityOptions.map((option) => (
                        <motion.label
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-4 ${isMobile ? 'p-3' : 'p-4'} rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.priority === option.value
                              ? `${option.bgColor} border-current ${option.color}`
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={formData.priority === option.value}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold ${option.color}`}>
                              {option.label}
                            </div>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
                              {option.description}
                            </div>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Fields */}
                {fields.filter(field => !["title", "description", "priority"].includes(field)).map((field) => (
                  <div key={field}>
                    <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                      <span className="flex items-center gap-2">
                        {field.includes("Date") || field.includes("ETA") ? (
                          <FiCalendar className="text-green-500" />
                        ) : (
                          <FiFileText className="text-blue-500" />
                        )}
                        {labels[field]}
                      </span>
                    </label>
                    
                    {field.includes("ETA") ? (
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="datetime-local"
                        name={field}
                        value={formData[field]}
                        className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed`}
                        readOnly
                      />
                    ) : field.includes("Date") ? (
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="date"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800`}
                      />
                    ) : (
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${labels[field].toLowerCase()}`}
                        className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Section */}
            <div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 mb-6 flex items-center gap-2`}>
                <FiUser className="text-purple-500" />
                Assignment & Routing
              </h3>
              
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-8'}`}>
                {/* Department */}
                <div>
                  <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                    <span className="flex items-center gap-2">
                      <FiBuilding className="text-purple-500" />
                      Department *
                    </span>
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 ${
                      validationErrors.department ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    } focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </motion.select>
                  {validationErrors.department && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      <FiX className="w-4 h-4" />
                      {validationErrors.department}
                    </motion.p>
                  )}
                </div>

                {/* Assigned To */}
                <div>
                  <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>
                    <span className="flex items-center gap-2">
                      <FiUser className="text-purple-500" />
                      Assigned To *
                    </span>
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className={`w-full ${isMobile ? 'px-3 py-3' : 'px-4 py-4'} rounded-xl border-2 ${
                      validationErrors.assignedTo ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    } focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800`}
                    required
                  >
                    <option value="">Select Assignee</option>
                    {users.filter((user) => user.department === formData.department).map((user) => (
                      <option key={user.email} value={user.email}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </motion.select>
                  {validationErrors.assignedTo && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      <FiX className="w-4 h-4" />
                      {validationErrors.assignedTo}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
                <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
                  <FiInfo className="w-5 h-5 text-blue-500" />
                  <span>All fields marked with * are required</span>
                </div>
                
                <div className={`flex gap-4 ${isMobile ? 'w-full' : ''}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSelectedType("")}
                    className={`${isMobile ? 'flex-1' : ''} px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors duration-200`}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isMobile ? 'flex-1' : ''} px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        Create Ticket
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
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
              className={`bg-white rounded-3xl shadow-2xl ${isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'} w-full text-center`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`${isMobile ? 'w-16 h-16 text-4xl' : 'w-20 h-20 text-5xl'} bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <FiCheck className="text-green-600" />
              </motion.div>
              
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 mb-4`}>
                Ticket Created Successfully!
              </h2>
              
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-xl mb-6`}>
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-2`}>
                  Your {selectedType} ticket has been created:
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-blue-600`}>
                  {createdTicketId}
                </p>
              </div>
              
              <div className={`flex gap-3 ${isMobile ? 'flex-col' : ''}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/ticket/${createdTicketDbId}`)}
                  className={`${isMobile ? 'w-full' : 'flex-1'} px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors`}
                >
                  View Ticket
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSelectedType("");
                    setFormData({
                      title: "",
                      description: "",
                      priority: "P3",
                      assignedTo: "",
                      department: "",
                      ticketType: "",
                      plannedStart: "",
                      plannedEnd: "",
                      requestedItem: "",
                      justification: "",
                      dueDate: "",
                      responseETA: "",
                      resolutionETA: ""
                    });
                  }}
                  className={`${isMobile ? 'w-full' : 'flex-1'} px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors`}
                >
                  Create Another
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateTicket;