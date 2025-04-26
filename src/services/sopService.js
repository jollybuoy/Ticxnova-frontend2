// src/services/sopService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/sops";

// Fetch all SOPs
export const fetchSOPs = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Upload new SOP
export const uploadSOP = async (formData) => {
  const response = await axios.post(`${API_URL}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
