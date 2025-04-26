import React, { useEffect, useState } from "react";
import { FiFileText, FiUpload, FiSearch, FiBookOpen, FiDownload } from "react-icons/fi";
import axios from "axios";

const KnowledgeBase = () => {
  const [sops, setSops] = useState([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // ✅ Fetch all SOPs from backend
  useEffect(() => {
    fetchSops();
  }, []);

  const fetchSops = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/sops", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSops(response.data);
    } catch (err) {
      console.error("Failed to fetch SOPs:", err.message);
    }
  };

  // ✅ Upload new SOP
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/sops/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Document uploaded successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      fetchSops();
    } catch (err) {
      console.error("Upload failed:", err.message);
      alert("❌ Failed to upload document");
    }
  };

  // ✅ Filtered SOPs
  const filteredSops = sops.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 text-gray-800 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiBookOpen className="text-blue-600" /> Knowledge Base
        </h1>
        <p className="text-sm text-gray-500 mt-1">Explore SOPs and Upload Documents</p>
      </div>

      {/* 🔵 Upload Section */}
      <form onSubmit={handleUpload} className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-2xl mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Title"
            className="flex-1 p-3 rounded-lg border"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="flex-1 p-3 rounded-lg border"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            type="file"
            className="flex-1 p-2"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <textarea
          placeholder="Description"
          className="w-full p-3 rounded-lg border mt-4"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center gap-2"
        >
          <FiUpload /> Upload SOP
        </button>
      </form>

      {/* 🔵 Search */}
      <div className="relative w-72 mb-6">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search SOPs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 outline-none"
        />
      </div>

      {/* 🔵 SOP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSops.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-2xl shadow-lg bg-gradient-to-br from-white to-blue-50 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-lg">
                <FiFileText className="text-blue-500" /> {doc.title}
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">{doc.fileType}</span>
            </div>
            <p className="text-sm text-gray-700 mb-2 line-clamp-3">{doc.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
              {doc.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <div>📅 {doc.updatedAt}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center gap-1"
              >
                <FiDownload /> View
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSops.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No SOPs found.
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
