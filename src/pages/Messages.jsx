import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import {
  FaInbox,
  FaFolder,
  FaReply,
  FaReplyAll,
  FaShareSquare,
  FaTrashAlt,
  FaPaperPlane,
  FaPlus,
} from "react-icons/fa";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeMode, setComposeMode] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });
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

  const sendMail = async () => {
    try {
      const mail = {
        message: {
          subject: composeData.subject,
          body: { contentType: "HTML", content: composeData.body },
          toRecipients: [{ emailAddress: { address: composeData.to } }],
          ccRecipients: composeData.cc
            ? [{ emailAddress: { address: composeData.cc } }]
            : [],
          bccRecipients: composeData.bcc
            ? [{ emailAddress: { address: composeData.bcc } }]
            : [],
        },
        saveToSentItems: true,
      };

      const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mail),
      });

      if (response.ok) {
        alert("Mail sent successfully!");
        setComposeMode(false);
      } else {
        alert("Failed to send mail.");
      }
    } catch (error) {
      console.error("Error sending mail", error);
    }
  };

  const deleteEmail = async (emailId) => {
    try {
      await fetch(`https://graph.microsoft.com/v1.0/me/messages/${emailId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEmails((prev) => prev.filter((email) => email.id !== emailId));
      setSelectedEmail(null);
    } catch (error) {
      console.error("Error deleting email", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) fetchEmails();
  }, [selectedFolderId]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Pane */}
      <aside className="w-1/4 bg-white border-r border-gray-200 p-4">
        <h3 className="text-lg font-bold mb-4">Folders</h3>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={`p-2 rounded cursor-pointer ${
                selectedFolderId === folder.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <FaFolder className="inline mr-2" /> {folder.displayName}
            </li>
          ))}
        </ul>
      </aside>

      {/* Email List */}
      <main className="w-1/2 p-4">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Emails</h2>
          <button
            onClick={() => setComposeMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <FaPlus className="inline mr-2" /> Compose
          </button>
        </header>
        <ul className="space-y-4">
          {emails.map((email) => (
            <li
              key={email.id}
              className={`p-4 rounded border ${
                selectedEmail?.id === email.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <h3 className="font-bold">{email.subject || "(No Subject)"}</h3>
              <p className="text-sm text-gray-500">
                From: {email.from?.emailAddress?.name || "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      </main>

      {/* Email Details */}
      {selectedEmail && (
        <section className="w-1/4 bg-white p-4 border-l border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{selectedEmail.subject}</h3>
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
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setComposeMode(true);
                setComposeData({
                  to: selectedEmail.from?.emailAddress?.address,
                  subject: `Re: ${selectedEmail.subject}`,
                  body: "",
                });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              <FaReply className="inline mr-2" /> Reply
            </button>
            <button
              onClick={() => deleteEmail(selectedEmail.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <FaTrashAlt className="inline mr-2" /> Delete
            </button>
          </div>
        </section>
      )}

      {/* Compose Mail Modal */}
      {composeMode && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <header className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Compose Mail</h3>
              <button onClick={() => setComposeMode(false)}>✖</button>
            </header>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="To"
                className="w-full p-2 border rounded"
                value={composeData.to}
                onChange={(e) =>
                  setComposeData({ ...composeData, to: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CC"
                className="w-full p-2 border rounded"
                value={composeData.cc}
                onChange={(e) =>
                  setComposeData({ ...composeData, cc: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="BCC"
                className="w-full p-2 border rounded"
                value={composeData.bcc}
                onChange={(e) =>
                  setComposeData({ ...composeData, bcc: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-2 border rounded"
                value={composeData.subject}
                onChange={(e) =>
                  setComposeData({ ...composeData, subject: e.target.value })
                }
              />
              <textarea
                placeholder="Body"
                className="w-full p-2 border rounded"
                rows="5"
                value={composeData.body}
                onChange={(e) =>
                  setComposeData({ ...composeData, body: e.target.value })
                }
              ></textarea>
              <button
                type="button"
                onClick={sendMail}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                <FaPaperPlane className="inline mr-2" /> Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
