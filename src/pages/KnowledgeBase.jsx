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

  // Ensure folders exist in OneDrive
  const ensureFoldersExist = async () => {
    try {
      // Check if the SOPs folder exists, and create it if not
      const sopFolderResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/root/children`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const sopFolderData = await sopFolderResponse.json();
      const sopFolder = sopFolderData.value.find((folder) => folder.name === "SOPs");

      if (!sopFolder) {
        console.log("Creating SOPs folder...");
        await createFolder("SOPs");
      }

      // Check and create Public and Private subfolders
      const subfoldersResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${"SOPs"}:/children`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const subfoldersData = await subfoldersResponse.json();
      const publicFolder = subfoldersData.value.find((folder) => folder.name === "Public");
      const privateFolder = subfoldersData.value.find((folder) => folder.name === "Private");

      if (!publicFolder) {
        console.log("Creating Public folder...");
        await createFolder(PUBLIC_FOLDER);
      }

      if (!privateFolder) {
        console.log("Creating Private folder...");
        await createFolder(PRIVATE_FOLDER);
      }
    } catch (error) {
      console.error("Error ensuring folders exist:", error);
    }
  };

  // Function to create a folder
  const createFolder = async (folderPath) => {
    const folderName = folderPath.split("/").pop();
    const parentPath = folderPath.includes("/") ? folderPath.split("/").slice(0, -1).join("/") : "";

    try {
      const createFolderUrl = parentPath
        ? `https://graph.microsoft.com/v1.0/me/drive/root:/${parentPath}:/children`
        : `https://graph.microsoft.com/v1.0/me/drive/root/children`;

      const response = await fetch(createFolderUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          folder: {}, // This denotes that the item is a folder
          "@microsoft.graph.conflictBehavior": "rename",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create folder: ${folderName}`);
      }
      console.log(`Folder created: ${folderName}`);
    } catch (error) {
      console.error("Error creating folder:", error);
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
    getAccessToken().then(() => {
      ensureFoldersExist().then(() => {
        fetchFiles();
      });
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
      {/* Additional UI elements for public & private repositories */}
    </div>
  );
};

export default KnowledgeBase;
