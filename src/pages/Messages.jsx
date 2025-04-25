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
      <aside className="w-64 bg-[#121826] border-r border-white/10 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">📂 Folders</h3>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={`cursor-pointer p-2 rounded hover:bg-white/10 ${selectedFolderId === folder.id ? 'bg-white/20' : ''}`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              {folder.displayName}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📥 Outlook Messages</h2>
          <div className="text-sm text-gray-300">Signed in as: {accounts[0]?.userName}</div>
        </div>
        <div className="flex justify-between items-center mb-4 gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
            onClick={() => setCompose(true)}
          >
            ✉️ Compose
          </button>
          <div className="flex gap-2">
            <button className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-sm" onClick={() => {
              setCompose(true);
              setComposeTo(selectedEmail?.from?.emailAddress?.address || "");
              setComposeSubject(`Re: ${selectedEmail?.subject || ""}`);
              setComposeBody(`<br/><br/>---- Original Message ----<br/>${selectedEmail?.body?.content || ""}`);
            }}>↩️ Reply</button>
            <button className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-sm\" onClick={() => {
              setCompose(true);
              setComposeTo(selectedEmail?.from?.emailAddress?.address || "");
              setComposeCc(accounts[0]?.userName);
              setComposeSubject(`Re: ${selectedEmail?.subject || ""}`);
              setComposeBody(`<br/><br/>---- Original Message ----<br/>${selectedEmail?.body?.content || ""}`);
            }}>🔁 Reply All</button>
            <button className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-sm" onClick={() => {
              setCompose(true);
              setComposeSubject(`Fwd: ${selectedEmail?.subject || ""}`);
              setComposeBody(`<br/><br/>---- Forwarded Message ----<br/>${selectedEmail?.body?.content || ""}`);
            }}>➡️ Forward</button>
          </div>
        </div>
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
  <div className="flex gap-6 mt-6">
    <div className="w-1/2">
      <ul className="space-y-4">
        {filteredEmails.map((email) => (
          <li
            key={email.id}
            className={`p-4 rounded-lg border cursor-pointer transition ${selectedEmail.id === email.id ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
            onClick={() => openEmail(email)}
          >
            <h3 className="text-lg font-semibold">{email.subject || "(No Subject)"}</h3>
            <p className="text-sm text-gray-300">From: {email.from?.emailAddress?.name || "Unknown Sender"}</p>
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{email.bodyPreview}</p>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex-1 bg-white text-black p-6 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{selectedEmail.subject}</h3>
        <button className="text-sm text-red-500 hover:text-red-700" onClick={closeEmail}>✖ Close</button>
      </div>
      <p className="text-sm text-gray-700 mb-2">From: {selectedEmail.from?.emailAddress?.name || "Unknown Sender"}</p>
      <div className="max-h-[500px] overflow-y-auto border-t pt-4 text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content }} />

      {sendSuccess !== null && (
        <div className={`mt-4 px-4 py-2 rounded font-semibold text-sm ${sendSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {sendSuccess ? '✅ Email sent successfully!' : '❌ Failed to send email.'}
        </div>
      )}
    </div>
  </div>
)}
          </main>
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
