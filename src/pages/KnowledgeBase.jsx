// src/pages/KnowledgeBase.jsx
import React, { useState, useEffect } from "react";
import { FiFileText, FiUpload, FiSearch, FiBookOpen, FiUser, FiCloud, FiDownload } from "react-icons/fi";
import UploadDocument from "../components/UploadDocument";
import { msalInstance, loginRequest } from "../auth/msalConfig"; // ✅ Correct import
import { useMsal } from "@azure/msal-react"; // ✅ MSAL React hook
import axios from "axios";

const KnowledgeBase = () => {
  const { accounts } = useMsal();
  const [activeTab, setActiveTab] = useState("public");
  const [search, setSearch] = useState("");
  const [userDocs, setUserDocs] = useState([]);
  const [publicDocs, setPublicDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch documents from OneDrive (for public repository tab)
  const fetchOneDriveDocs = async () => {
    if (!accounts.length) return;

    try {
      setLoading(true);
      const response = await msalInstance.acquireTokenSilent({
        scopes: loginRequest.scopes,
        account: accounts[0]
      });

      const accessToken = response.accessToken;

      const onedriveResponse = await axios.get("/api/onedrive/documents", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setPublicDocs(onedriveResponse.data);
    } catch (error) {
      console.error("❌ Failed to fetch OneDrive documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOneDriveDocs();
  }, [accounts]);

  const handleUserUpload = (newDoc) => {
    setUserDocs((prev) => [newDoc, ...prev]);
  };

  const filteredDocs = (activeTab === "public" ? publicDocs : userDocs).filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 text-gray-800 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiBookOpen className="text-blue-600" /> Knowledge Base
        </h1>
        <p className="text-sm text-gray-500 mt-1">Explore helpful guides and upload your own documents.</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("public")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${activeTab === "public" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            📘 Public Repository
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${activeTab === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            🗂 My Documents
          </button>
        </div>
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tag..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 outline-none"
          />
        </div>
      </div>

      {activeTab === "user" && <UploadDocument onUpload={handleUserUpload} />}

      {loading ? (
        <div className="text-center text-gray-500 mt-20">Loading documents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-2xl shadow-lg bg-gradient-to-br from-white to-blue-50 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <FiFileText className="text-blue-500" /> {doc.title}
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">{doc.type}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-3">{doc.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                {doc.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <div className="flex items-center gap-1">
                  {doc.owner === "Admin" ? <FiCloud /> : <FiUser />} {doc.owner}
                </div>
                <div>📅 {doc.updatedAt}</div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <a
                  href={`https://graph.microsoft.com/v1.0/me/drive/items/${doc.id}/content`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <FiDownload className="inline mr-1" /> View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDocs.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-20">
          No documents found.
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
