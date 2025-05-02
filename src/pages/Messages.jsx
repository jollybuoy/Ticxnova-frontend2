import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import {
  FaInbox,
  FaFileAlt,
  FaTrashAlt,
  FaPaperPlane,
  FaReply,
  FaReplyAll,
  FaShareSquare,
  FaSearch,
  FaPlus,
  FaSyncAlt,
  FaAddressBook,
  FaFolder,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null); // Index of selected email
  const [composeMode, setComposeMode] = useState(null); // Modes: "new", "reply", "replyAll", "forward"
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, email: null });
  const [addressBookVisible, setAddressBookVisible] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [lastInboxEmailId, setLastInboxEmailId] = useState(null); // Tracks the latest email ID in the inbox

  const soundNotification = new Audio("/notification-sound.mp3");

  const fetchFolders = async (parentFolderId = null) => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["Mail.Read"],
        account: accounts[0],
      });
      setAccessToken(response.accessToken);

      const folderResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/mailFolders${
          parentFolderId ? `/${parentFolderId}/childFolders` : ""
        }`,
        {
          headers: { Authorization: `Bearer ${response.accessToken}` },
        }
      );
      const data = await folderResponse.json();
      if (parentFolderId) {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === parentFolderId
              ? { ...folder, childFolders: data.value }
              : folder
          )
        );
      } else {
        setFolders(data.value || []);
      }
    } catch (error) {
      console.error("Error fetching folders", error);
    }
  };

  const fetchEmails = async (folderId = selectedFolderId, notify = false) => {
    try {
      console.log(`Fetching emails for folder: ${folderId}`);
      const mailResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await mailResponse.json();
      setEmails(data.value || []);

      // Check for new emails in the inbox
      if (notify && folderId === "inbox" && data.value.length > 0) {
        const latestEmail = data.value[0];
        if (latestEmail.id !== lastInboxEmailId) {
          setLastInboxEmailId(latestEmail.id);
          triggerNotification(latestEmail);
        }
      }
    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  const triggerNotification = (email) => {
    if (Notification.permission === "granted") {
      new Notification("New Email Received", {
        body: `${email.subject}\nFrom: ${email.from?.emailAddress?.name}`,
      });
      soundNotification.play(); // Play sound for each notification
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Email Received", {
            body: `${email.subject}\nFrom: ${email.from?.emailAddress?.name}`,
          });
          soundNotification.play();
        }
      });
    }
  };

  const markAsReadUnread = async (email, isRead) => {
    try {
      await fetch(`https://graph.microsoft.com/v1.0/me/messages/${email.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead }),
      });
      // Update the email state to reflect the change
      setEmails((prevEmails) =>
        prevEmails.map((e) =>
          e.id === email.id ? { ...e, isRead } : e
        )
      );
    } catch (error) {
      console.error("Error updating email read/unread status", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) fetchEmails();
  }, [selectedFolderId]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchEmails("inbox", true);
    }, 30000); // 30 seconds
    return () => clearInterval(refreshInterval);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" && selectedEmailIndex > 0) {
      setSelectedEmailIndex((prevIndex) => prevIndex - 1);
    } else if (event.key === "ArrowDown" && selectedEmailIndex < emails.length - 1) {
      setSelectedEmailIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleContextMenu = (event, email) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY, email });
  };

  const closeContextMenu = () => setContextMenu({ visible: false });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emails, selectedEmailIndex]);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Pane */}
      <header className="flex items-center bg-gray-200 p-4 border-b">
        {/* Other buttons */}
        <button
          className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => fetchEmails()}
        >
          <FaSyncAlt className="mr-2" /> Send/Receive
        </button>
      </header>

      <div className="flex flex-grow">
        {/* Navigation Pane */}
        <aside className="w-1/5 bg-gray-100 border-r border-gray-300 p-4">
          <h3 className="text-lg font-bold mb-4">Folders</h3>
        </aside>

        {/* Email List */}
        <main className="w-2/5 bg-white border-r border-gray-300 p-4">
          <ul>
            {emails.map((email, index) => (
              <li
                key={email.id}
                onContextMenu={(e) => handleContextMenu(e, email)}
                className={`p-4 border ${selectedEmailIndex === index ? "bg-blue-100" : ""}`}
              >
                {email.subject}
              </li>
            ))}
          </ul>
        </main>
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-white shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => markAsReadUnread(contextMenu.email, true)}>Mark as Read</button>
          <button onClick={() => markAsReadUnread(contextMenu.email, false)}>Mark as Unread</button>
        </div>
      )}
    </div>
  );
};

export default Messages;
