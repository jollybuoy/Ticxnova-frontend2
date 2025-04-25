// src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

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
  const [composeCc, setComposeCc] = useState("");
  const [composeBcc, setComposeBcc] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const filteredEmails = emails.filter(email =>
    email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from?.emailAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["Mail.Read", "Mail.Send"],
          account: accounts[0],
        });
        setAccessToken(response.accessToken);

        const folderResponse = await fetch("https://graph.microsoft.com/v1.0/me/mailFolders", {
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

    fetchFolders();
  }, [instance, accounts]);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["Mail.Read"],
          account: accounts[0],
        });
        setAccessToken(response.accessToken);

        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const mailResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/mailFolders/${selectedFolderId}/messages?$top=10&$filter=receivedDateTime ge ${lastWeek}`,
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

    if (selectedFolderId) {
      fetchEmails();
    }
  }, [instance, accounts, selectedFolderId]);

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

  const closeEmail = () => setSelectedEmail(null);

  const sendMail = async () => {
    const encodedAttachments = await Promise.all(
      attachments.map(async (file) => ({
        ...file,
        base64: await toBase64(file.file),
      }))
    );

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
          ccRecipients: composeCc ? [{ emailAddress: { address: composeCc } }] : [],
          bccRecipients: composeBcc ? [{ emailAddress: { address: composeBcc } }] : [],
          attachments: encodedAttachments.map(file => ({
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: file.name,
            contentBytes: file.base64,
            contentType: file.type
          }))
        },
        saveToSentItems: true
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
        setCompose(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeCc("");
        setComposeBcc("");
        setComposeBody("");
        setAttachments([]);
      } else {
        setSendSuccess(false);
      }
    } catch (err) {
      console.error("Error sending mail", err);
      setSendSuccess(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">📥 Outlook Messages</h2>

      <div className="mb-4 flex justify-between items-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
          onClick={() => setCompose(true)}
        >
          ✉️ Compose New Message
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold">Search by Subject or Sender:</label>
        <input
          type="text"
          className="text-black p-2 w-full rounded-md mb-4"
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="block mb-2 text-sm font-semibold">Select Folder:</label>
        <select
          className="text-black p-2 rounded-md"
          value={selectedFolderId}
          onChange={(e) => setSelectedFolderId(e.target.value)}
        >
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.displayName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : filteredEmails.length > 0 ? (
        <ul className="space-y-4">
          {filteredEmails.map((email) => (
            <li
              key={email.id}
              className="bg-white/10 p-4 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20"
              onClick={() => openEmail(email)}
            >
              <h3 className="text-lg font-semibold">{email.subject || "(No Subject)"}</h3>
              <p className="text-sm text-gray-300">
                From: {email.from?.emailAddress?.name || "Unknown Sender"}
              </p>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {email.bodyPreview}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails found in this folder.</p>
      )}

      {selectedEmail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-2xl max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
              onClick={closeEmail}
            >
              ✖ Close
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedEmail.subject}</h3>
            <p className="text-sm text-gray-700 mb-2">
              From: {selectedEmail.from?.emailAddress?.name || "Unknown Sender"}
            </p>
            <div
              className="max-h-[400px] overflow-y-auto border-t pt-4 text-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = (error) => reject(error);
});

export default Messages;
