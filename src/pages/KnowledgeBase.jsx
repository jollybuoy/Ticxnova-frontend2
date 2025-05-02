import React, { useState, useEffect } from "react";
import { FiFileText, FiUpload, FiSearch, FiBookOpen, FiUser, FiCloud, FiDownload } from "react-icons/fi";
import { msalInstance, loginRequest } from "../auth/msalConfig";
import UploadDocument from "../components/UploadDocument";

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState("public");
  const [search, setSearch] = useState("");
  const [publicDocs, setPublicDocs] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const PUBLIC_FOLDER = "SOPs/Public";
  const PRIVATE_FOLDER = "SOPs/Private";

  // Fetch Access Token
  const fetchAccessToken = async () => {
    try {
      const response = await msalInstance.acquireTokenSilent(loginRequest);
      setAccessToken(response.accessToken);
    } catch (error) {
      console.error("Failed to acquire token:", error);
    }
  };

  // Ensure Folders Exist
  const ensureFoldersExist = async () => {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();

      const sopFolder = data.value.find((folder) => folder.name === "SOPs");
      if (!sopFolder) {
        await createFolder("SOPs");
      }

      const subfoldersResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/SOPs:/children`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const subfolders = await subfoldersResponse.json();

      if (!subfolders.value.find((folder) => folder.name === "Public")) {
        await createFolder(PUBLIC_FOLDER);
      }
      if (!subfolders.value.find((folder) => folder.name === "Private")) {
        await createFolder(PRIVATE_FOLDER);
      }
    } catch (error) {
      console.error("Error ensuring folders exist:", error);
    }
  };

  const createFolder = async (folderPath) => {
    const folderName = folderPath.split("/").pop();
    const parentPath = folderPath.includes("/") ? folderPath.split("/").slice(0, -1).join("/") : "";

    const url = parentPath
      ? `https://graph.microsoft.com/v1.0/me/drive/root:/${parentPath}:/children`
      : `https://graph.microsoft.com/v1.0/me/drive/root/children`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          folder: {},
          "@microsoft.graph.conflictBehavior": "rename",
        }),
      });
    } catch (error) {
      console.error(`Error creating folder (${folderName}):`, error);
    }
  };

  // Fetch Documents
  const fetchDocuments = async (folderPath, setter) => {
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${folderPath}:/children`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        const docs = data.value.map((doc) => ({
          id: doc.id,
          title: doc.name,
          tags: ["OneDrive"], // Example tag, replace with metadata if available
          description: "Document stored in OneDrive.",
          type: doc.name.split(".").pop(),
          updatedAt: doc.lastModifiedDateTime.split("T")[0],
          owner: "Admin", // Replace with owner info if available
        }));
        setter(docs);
      }
    } catch (error) {
      console.error(`Error fetching documents from ${folderPath}:`, error);
    }
  };

  // Handle Upload
  const handleUserUpload = async (file) => {
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${PRIVATE_FOLDER}/${file.name}:/content`;
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type,
        },
        body: file,
      });

      if (response.ok) {
        const uploadedFile = await response.json();
        const newDoc = {
          id: uploadedFile.id,
          title: uploadedFile.name,
          tags: ["OneDrive"],
          description: "Uploaded to OneDrive.",
          type: uploadedFile.name.split(".").pop(),
          updatedAt: uploadedFile.lastModifiedDateTime.split("T")[0],
          owner: "me",
        };
        setUserDocs((prev) => [newDoc, ...prev]);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  useEffect(() => {
    fetchAccessToken().then(() => {
      ensureFoldersExist().then(() => {
        fetchDocuments(PUBLIC_FOLDER, setPublicDocs);
        fetchDocuments(PRIVATE_FOLDER, setUserDocs);
      });
    });
  }, []);

  const filteredDocs = (activeTab === "public" ? publicDocs : userDocs).filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
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
              <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                <FiDownload className="inline mr-1" /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No documents found.
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
