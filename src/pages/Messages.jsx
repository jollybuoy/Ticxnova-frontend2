import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { FaFolder, FaInbox, FaEnvelope, FaReply, FaReplyAll, FaShareSquare, FaTrashAlt } from "react-icons/fa";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [emails, setEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [compose, setCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  const fetchFolders = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["Mail.Read", "Mail.Send"],
        account: accounts[0],
      });
      setAccessToken(response.accessToken);

      const folderResponse = await fetch("https://graph.microsoft.com/v1.0/me/mailFolders?$top=100", {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      const folderData = await folderResponse.json();
      setFolders(folderData.value || []);
    } catch (error) {
      console.error("Error fetching folders", error);
    }
  };

  const fetchEmails = async (folderId = selectedFolderId) => {
    setLoading(true);
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["Mail.Read"],
        account: accounts[0],
      });
      setAccessToken(response.accessToken);

      const mailResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages?$top=10`,
        {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }
      );

      const data = await mailResponse.json();
      setEmails(data.value || []);
    } catch (error) {
      console.error("Error fetching emails", error);
    } finally {
      setLoading(false);
    }
  };

  const openEmail = async (email) => {
    try {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages/${email.id}?$select=subject,body,from`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const fullEmail = await response.json();
      setSelectedEmail(fullEmail);
    } catch (error) {
      console.error("Error loading full email", error);
    }
  };

  const sendMail = async () => {
    setSending(true);
    try {
      const mail = {
        message: {
          subject: composeSubject,
          body: {
            contentType: "HTML",
            content: composeBody,
          },
          toRecipients: [{ emailAddress: { address: composeTo } }],
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
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(null), 3000);
        setCompose(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
      } else {
        setSendSuccess(false);
        setTimeout(() => setSendSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error sending mail", err);
      setSendSuccess(false);
    } finally {
      setSending(false);
    }
  };

  const deleteEmail = async (emailId) => {
    try {
      await fetch(`https://graph.microsoft.com/v1.0/me/messages/${emailId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== emailId));
      setSelectedEmail(null);
    } catch (error) {
      console.error("Error deleting email", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [instance, accounts]);

  useEffect(() => {
    if (selectedFolderId) {
      fetchEmails();
    }
  }, [selectedFolderId]);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Left Pane: Folder List */}
      <aside className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">📂 Folders</h3>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                selectedFolderId === folder.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <FaFolder className="inline mr-2 text-blue-500" />
              {folder.displayName}
            </li>
          ))}
        </ul>
      </aside>

      {/* Middle Pane: Email List */}
      <main className="w-1/2 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📥 Emails</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => fetchEmails()}
          >
            🔄 Refresh
          </button>
        </div>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          <p>Loading emails...</p>
        ) : (
          <ul className="space-y-4">
            {emails.map((email) => (
              <li
                key={email.id}
                className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                  selectedEmail?.id === email.id ? "bg-gray-100" : ""
                }`}
                onClick={() => openEmail(email)}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">{email.subject || "(No Subject)"}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(email.receivedDateTime).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">From: {email.from?.emailAddress?.name || "Unknown Sender"}</p>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Right Pane: Email Details */}
      {selectedEmail && (
        <section className="w-1/4 bg-white p-4 border-l border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">{selectedEmail.subject}</h3>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setSelectedEmail(null)}
            >
              ✖
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-500">From: {selectedEmail.from?.emailAddress?.name}</p>
            <div
              className="mt-4 text-sm text-gray-800 border-t pt-4"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content }}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                setCompose(true);
                setComposeTo(selectedEmail.from?.emailAddress?.address || "");
                setComposeSubject(`Re: ${selectedEmail.subject}`);
              }}
            >
              Reply
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => {
                setCompose(true);
                setComposeTo(selectedEmail.from?.emailAddress?.address || "");
                setComposeSubject(`Re: ${selectedEmail.subject}`);
              }}
            >
              Forward
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => deleteEmail(selectedEmail.id)}
            >
              Delete
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Messages;
