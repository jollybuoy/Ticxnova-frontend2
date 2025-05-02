import React, { useState, useEffect } from "react";
import { msalInstance, loginRequest } from "../auth/msalConfig";
import { FaUpload, FaLock, FaUnlock, FaFileAlt } from "react-icons/fa";

const KnowledgeBase = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [publicFiles, setPublicFiles] = useState([]);
  const [privateFiles, setPrivateFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [uploadStatus, setUploadStatus] = useState("");

  const PUBLIC_FOLDER = "SOPs/Public";
  const PRIVATE_FOLDER = "SOPs/Private";

  // Authenticate and get access token
  const getAccessToken = async () => {
    try {
      const response = await msalInstance.acquireTokenSilent(loginRequest);
      setAccessToken(response.accessToken);
    } catch (error) {
      console.error("Error acquiring token:", error);
    }
  };

  // Upload file to OneDrive
  const handleFileUpload = async () => {
    if (!uploadFile || !fileName) {
      alert("Please provide a file and a name.");
      return;
    }

    try {
      setUploadStatus("Uploading...");
      const folderPath = visibility === "public" ? PUBLIC_FOLDER : PRIVATE_FOLDER;
      const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${folderPath}/${fileName}:/content`;

      // Upload file to OneDrive
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": uploadFile.type,
        },
        body: uploadFile,
      });

      if (response.ok) {
        const fileData = await response.json();

        // If public, set sharing permissions
        if (visibility === "public") {
          await setPublicPermission(fileData.id);
        }

        setUploadStatus("File uploaded successfully!");
        fetchFiles(); // Refresh file list
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("File upload failed.");
    }
  };

  // Set file permission to public
  const setPublicPermission = async (fileId) => {
    try {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "view", scope: "organization" }), // Share within the domain
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set public permission.");
      }
    } catch (error) {
      console.error("Error setting public permission:", error);
    }
  };

  // Fetch public and private files
  const fetchFiles = async () => {
    try {
      // Fetch public files
      const publicResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${PUBLIC_FOLDER}:/children`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        setPublicFiles(publicData.value || []);
      }

      // Fetch private files
      const privateResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${PRIVATE_FOLDER}:/children`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (privateResponse.ok) {
        const privateData = await privateResponse.json();
        setPrivateFiles(privateData.value || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    getAccessToken();
    fetchFiles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>

      {/* Tabs for Public and Private Repositories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Public Repository</h2>
        <ul>
          {publicFiles.map((file) => (
            <li key={file.id}>
              <a
                href={file.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Private Repository</h2>
        <ul>
          {privateFiles.map((file) => (
            <li key={file.id}>
              <FaFileAlt className="inline-block mr-2" />
              {file.name}
            </li>
          ))}
        </ul>
      </div>

      {/* File Upload Form */}
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Upload File</h2>
        <input
          type="text"
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
        ></textarea>
        <input
          type="file"
          onChange={(e) => setUploadFile(e.target.files[0])}
          className="mb-2"
        />
        <div className="mb-2">
          <label>
            <input
              type="radio"
              value="private"
              checked={visibility === "private"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Private
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="public"
              checked={visibility === "public"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Public
          </label>
        </div>
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <FaUpload className="inline-block mr-2" />
          Upload
        </button>
        {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default KnowledgeBase;
