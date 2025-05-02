import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import {
  FaInbox,
  FaDrafts,
  FaTrashAlt,
  FaPaperPlane,
  FaReply,
  FaReplyAll,
  FaShareSquare,
  FaSearch,
  FaPlus,
  FaCaretDown,
  FaCaretRight,
} from "react-icons/fa";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showTasksPane, setShowTasksPane] = useState(true);
  const [composeMode, setComposeMode] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const fetchFolders = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["Mail.Read"],
        account: accounts[0],
      });
      setAccessToken(response.accessToken);

      const folderResponse = await fetch("https://graph.microsoft.com/v1.0/me/mailFolders", {
        headers: { Authorization: `Bearer ${response.accessToken}` },
      });
      const data = await folderResponse.json();
      setFolders(data.value || []);
    } catch (error) {
      console.error("Error fetching folders", error);
    }
  };

  const fetchEmails = async (folderId = selectedFolderId) => {
    try {
      const mailResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await mailResponse.json();
      setEmails(data.value || []);
    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) fetchEmails();
  }, [selectedFolderId]);

  return (
    <div className="flex h-screen">
      {/* Navigation Pane */}
      <aside className="w-1/5 bg-gray-100 border-r border-gray-300 p-4">
        <h3 className="text-lg font-bold mb-4">Favorites</h3>
        <ul className="mb-6 space-y-2">
          <li
            className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedFolderId === "inbox" ? "bg-gray-300" : ""
            }`}
            onClick={() => setSelectedFolderId("inbox")}
          >
            <FaInbox className="inline mr-2" /> Inbox
          </li>
          <li
            className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedFolderId === "drafts" ? "bg-gray-300" : ""
            }`}
            onClick={() => setSelectedFolderId("drafts")}
          >
            <FaDrafts className="inline mr-2" /> Drafts
          </li>
          <li
            className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedFolderId === "sent" ? "bg-gray-300" : ""
            }`}
            onClick={() => setSelectedFolderId("sent")}
          >
            <FaPaperPlane className="inline mr-2" /> Sent
          </li>
          <li
            className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedFolderId === "deleted" ? "bg-gray-300" : ""
            }`}
            onClick={() => setSelectedFolderId("deleted")}
          >
            <FaTrashAlt className="inline mr-2" /> Deleted
          </li>
        </ul>
        <h3 className="text-lg font-bold mb-4">Folders</h3>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFolderId === folder.id ? "bg-gray-300" : ""
              }`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <FaCaretRight className="inline mr-2" /> {folder.displayName}
            </li>
          ))}
        </ul>
      </aside>

      {/* Email List */}
      <main className="w-2/5 bg-white border-r border-gray-300 p-4">
        <header className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Emails</h2>
          <div className="flex items-center">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded px-2 py-1"
            />
          </div>
        </header>
        <ul className="space-y-4">
          {emails.map((email) => (
            <li
              key={email.id}
              className={`p-4 border rounded cursor-pointer ${
                selectedEmail?.id === email.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <h3 className="font-bold">{email.subject || "(No Subject)"}</h3>
              <p className="text-gray-500">{email.from?.emailAddress?.name}</p>
              <p className="text-sm text-gray-400">{email.bodyPreview}</p>
            </li>
          ))}
        </ul>
      </main>

      {/* Email Details */}
      {selectedEmail && (
        <section className="w-2/5 bg-gray-50 p-4">
          <header className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
            <button
              onClick={() => setSelectedEmail(null)}
              className="text-red-500"
            >
              ✖
            </button>
          </header>
          <p>
            <strong>From:</strong> {selectedEmail.from?.emailAddress?.name}
          </p>
          <div
            className="mt-4 border-t pt-4"
            dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content }}
          ></div>
          <div className="mt-4 flex justify-between">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              <FaReply className="inline mr-2" /> Reply
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              <FaReplyAll className="inline mr-2" /> Reply All
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              <FaShareSquare className="inline mr-2" /> Forward
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              <FaTrashAlt className="inline mr-2" /> Delete
            </button>
          </div>
        </section>
      )}

      {/* Tasks Pane */}
      {showTasksPane && (
        <aside className="w-1/5 bg-white border-l border-gray-300 p-4">
          <header className="flex justify-between mb-4">
            <h3 className="text-lg font-bold">Tasks</h3>
            <button
              onClick={() => setShowTasksPane(false)}
              className="text-gray-400"
            >
              ✖
            </button>
          </header>
          <ul className="space-y-2">
            <li className="p-2 rounded border">Task 1</li>
            <li className="p-2 rounded border">Task 2</li>
            <li className="p-2 rounded border">Task 3</li>
          </ul>
        </aside>
      )}
    </div>
  );
};

export default Messages;
