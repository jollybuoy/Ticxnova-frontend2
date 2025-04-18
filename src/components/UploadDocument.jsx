// src/components/UploadDocument.jsx
import React, { useState } from "react";
import { FiUpload, FiX, FiFileText } from "react-icons/fi";
import { toast } from "react-hot-toast";

const UploadDocument = ({ onUpload }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error("Title and file are required.");
      return;
    }

    const newDoc = {
      id: Date.now(),
      title,
      description,
      tags: tags.split(",").map(t => t.trim()),
      type: file.name.split(".").pop(),
      updatedAt: new Date().toLocaleString(),
      owner: "me",
    };

    onUpload(newDoc);
    toast.success("📤 Document uploaded successfully!");
    setFormOpen(false);
    setTitle("");
    setDescription("");
    setTags("");
    setFile(null);
  };

  return (
    <div className="mt-8">
      {!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700"
        >
          <FiUpload /> Upload New Document
        </button>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-4 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <FiFileText /> Upload Document
            </h2>
            <button
              onClick={() => setFormOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                placeholder="e.g. How to setup MFA"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                placeholder="Brief description of the document"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                placeholder="e.g. VPN, Security"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Upload File *</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg"
            >
              🚀 Upload
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
