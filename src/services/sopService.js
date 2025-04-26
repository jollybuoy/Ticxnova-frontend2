// src/services/sopService.js
import axios from "axios";

// Fetch all SOP documents
export const getAllSopDocuments = async () => {
  const response = await axios.get("/api/sops");
  return response.data;
};

// Upload a new SOP document
export const uploadSopDocument = async (formData) => {
  const response = await axios.post("/api/sops", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
