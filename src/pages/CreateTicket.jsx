// src/pages/CreateTicket.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBug,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  HiWrenchScrewdriver,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
} from "react-icons/hi2";

const typeOptions = [
  { label: "Incident", icon: <FaBug />, color: "from-red-500 to-pink-500" },
  { label: "Service Request", icon: <HiWrenchScrewdriver />, color: "from-blue-500 to-sky-500" },
  { label: "Change Request", icon: <HiOutlineInformationCircle />, color: "from-purple-500 to-indigo-500" },
  { label: "Problem", icon: <HiOutlineLightBulb />, color: "from-orange-500 to-yellow-500" },
  { label: "Task", icon: <FaClipboardCheck />, color: "from-green-500 to-emerald-500" },
];

const fieldConfig = {
  Incident: ["title", "description", "priority"],
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
  dueDate: "Due Date"
};

const CreateTicket = () => {
  // ... component logic remains unchanged ...
};

export default CreateTicket;
