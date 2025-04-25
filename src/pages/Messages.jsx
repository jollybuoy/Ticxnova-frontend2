// src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [emails, setEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 10;
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

  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

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
        const inboxFirst = folderData.value?.sort((a, b) => a.displayName.toLowerCase() === "inbox" ? -1 : 1);
        setFolders(inboxFirst || []);
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
          `https://graph.microsoft.com/v1.0/me/mailFolders/${selectedFolderId}/messages?$top=20&$filter=receivedDateTime ge ${lastWeek}&$orderby=receivedDateTime desc`,
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
        `https://graph.microsoft.com/v1.0/me/messages/${email.id}?$select=subject,body,from,receivedDateTime`,
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
        setTimeout(() => setSendSuccess(null), 3000);
        setCompose(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeCc("");
        setComposeBcc("");
        setComposeBody("");
        setAttachments([]);
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

  return (
    <div className="flex h-screen text-white">
      {/* Folder List */}
      <aside className="w-60 bg-[#1c1e2f] border-r border-white/10 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">📂 Folders</h3>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={`cursor-pointer px-3 py-2 rounded hover:bg-white/10 ${selectedFolderId === folder.id ? 'bg-white/20' : ''}`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              {selectedFolderId === folder.id ? '📩 ' : '✉️ '}{folder.displayName}
            </li>
          ))}
        </ul>
      </aside>

      {/* Email List */}
      <main className="flex-1 p-6 overflow-y-auto border-r border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📥 Outlook Messages</h2>
          <div className="text-sm text-gray-300">Signed in as: {accounts[0]?.userName}</div>
        </div>

        <input
          type="text"
          className="text-black p-2 w-full rounded-md mb-4"
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p>Loading messages...</p>
        ) : filteredEmails.length > 0 ? (
          <ul className="space-y-3">
            {currentEmails.map((email) => (
              <li
                key={email.id}
                className={`p-4 rounded-md border cursor-pointer transition ${selectedEmail?.id === email.id ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                onClick={() => openEmail(email)}
              >
                <h3 className="font-semibold text-lg">{email.subject || "(No Subject)"}</h3>
                <div className="text-sm text-gray-300 flex justify-between">
                  <span>From: {email.from?.emailAddress?.name}</span>
                  <span>{new Date(email.receivedDateTime).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{email.bodyPreview}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ◀ Previous
            </button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>
        ) : (
          <p>No emails found in this folder.</p>
        )}
      </main>

      {/* Email Preview */}
      <section className="w-[40%] p-6 bg-white text-black overflow-y-auto">
        {selectedEmail ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedEmail.subject}</h3>
              <button onClick={closeEmail} className="text-red-500">✖</button>
            </div>
            <p className="text-sm mb-2 text-gray-600">From: {selectedEmail.from?.emailAddress?.name}</p>
            <p className="text-xs mb-4 text-gray-500">{new Date(selectedEmail.receivedDateTime).toLocaleString()}</p>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content }}
            />
          </>
        ) : (
          <p className="text-sm text-gray-500">No email selected</p>
        )}
      </section>
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
