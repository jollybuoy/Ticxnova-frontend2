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
} from "react-icons/fa";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeMode, setComposeMode] = useState(null); // Modes: "new", "reply", "replyAll", "forward"
  const [addressBookVisible, setAddressBookVisible] = useState(false);
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

  // Refresh emails every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchEmails();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [selectedFolderId]);

  const openComposeModal = (mode) => {
    setComposeMode(mode);
  };

  const toggleAddressBook = () => {
    setAddressBookVisible(!addressBookVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Pane */}
      <header className="flex items-center bg-gray-200 p-4 border-b">
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => openComposeModal("new")}
        >
          <FaPlus className="mr-2" /> New Mail
        </button>
        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => openComposeModal("reply")}
        >
          <FaReply className="mr-2" /> Reply
        </button>
        <button
          className="flex items-center bg-green-400 text-white px-4 py-2 rounded mr-4"
          onClick={() => openComposeModal("replyAll")}
        >
          <FaReplyAll className="mr-2" /> Reply All
        </button>
        <button
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => openComposeModal("forward")}
        >
          <FaShareSquare className="mr-2" /> Forward
        </button>
        <button
          className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => fetchEmails()}
        >
          <FaSyncAlt className="mr-2" /> Send/Receive
        </button>
        <button
          className="flex items-center bg-purple-500 text-white px-4 py-2 rounded"
          onClick={toggleAddressBook}
        >
          <FaAddressBook className="mr-2" /> Address Book
        </button>
      </header>

      <div className="flex flex-grow">
        {/* Navigation Pane */}
        <aside className="w-1/5 bg-gray-100 border-r border-gray-300 p-4">
          <h3 className="text-lg font-bold mb-4">Favorites</h3>
          <ul className="mb-6 space-y-2">
            <li
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFolderId === "inbox" ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedFolderId("inbox")}
            >
              <FaInbox className="inline mr-2" /> Inbox
            </li>
            <li
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFolderId === "drafts" ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedFolderId("drafts")}
            >
              <FaFileAlt className="inline mr-2" /> Drafts
            </li>
            <li
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFolderId === "sent" ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedFolderId("sent")}
            >
              <FaPaperPlane className="inline mr-2" /> Sent
            </li>
            <li
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFolderId === "deleted" ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedFolderId("deleted")}
            >
              <FaTrashAlt className="inline mr-2" /> Deleted
            </li>
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
                  selectedEmail?.id === email.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <h3 className="font-bold text-blue-600">{email.subject || "(No Subject)"}</h3>
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
          </section>
        )}
      </div>

      {/* Address Book Modal */}
      {addressBookVisible && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <header className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Address Book</h3>
              <button onClick={toggleAddressBook}>✖</button>
            </header>
            <p>Address book feature coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
