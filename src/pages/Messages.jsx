// src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

const Messages = () => {
  const { instance, accounts } = useMsal();
  const [emails, setEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [subFolders, setSubFolders] = useState({});
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["Mail.Read", "Mail.Send"],
          account: accounts[0],
        });
        setAccessToken(response.accessToken);

        const folderRes = await fetch("https://graph.microsoft.com/v1.0/me/mailFolders", {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });

        const folderData = await folderRes.json();
        const mainFolders = folderData.value || [];

        const subFolderMap = {};
        await Promise.all(
          mainFolders.map(async (folder) => {
            const subRes = await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/${folder.id}/childFolders`, {
              headers: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });
            const subData = await subRes.json();
            subFolderMap[folder.id] = subData.value || [];
          })
        );

        setFolders(mainFolders);
        setSubFolders(subFolderMap);
      } catch (err) {
        console.error("Error fetching folders", err);
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

        const mailRes = await fetch(
          `https://graph.microsoft.com/v1.0/me/mailFolders/${selectedFolderId}/messages?$top=10&$filter=receivedDateTime ge ${lastWeek}`,
          {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          }
        );

        const data = await mailRes.json();
        setEmails(data.value || []);
      } catch (err) {
        console.error("Error fetching emails", err);
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
    } catch (err) {
      console.error("Error opening email", err);
    }
  };

  const renderFolders = () => (
    <ul className="space-y-2">
      {folders.map((folder) => (
        <React.Fragment key={folder.id}>
          <li
            className={`cursor-pointer p-2 rounded hover:bg-white/10 ${selectedFolderId === folder.id ? 'bg-white/20' : ''}`}
            onClick={() => setSelectedFolderId(folder.id)}
          >
            {folder.displayName}
          </li>
          {subFolders[folder.id]?.map((sub) => (
            <li
              key={sub.id}
              className={`ml-4 cursor-pointer p-2 rounded hover:bg-white/5 text-sm ${selectedFolderId === sub.id ? 'bg-white/20' : ''}`}
              onClick={() => setSelectedFolderId(sub.id)}
            >
              📁 {sub.displayName}
            </li>
          ))}
        </React.Fragment>
      ))}
    </ul>
  );

  return (
    <div className="flex h-screen text-white">
      <aside className="w-64 bg-[#121826] border-r border-white/10 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">📂 Folders</h3>
        {renderFolders()}
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">📧 Emails</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {emails.map((email) => (
              <li
                key={email.id}
                className="p-4 border rounded bg-white/5 cursor-pointer"
                onClick={() => openEmail(email)}
              >
                <h3 className="text-md font-semibold">{email.subject || '(No Subject)'}</h3>
                <p className="text-sm text-gray-300">From: {email.from?.emailAddress?.name}</p>
              </li>
            ))}
          </ul>
        )}
        {selectedEmail && (
          <div className="mt-6 bg-white text-black p-4 rounded">
            <h3 className="text-lg font-bold mb-2">{selectedEmail.subject}</h3>
            <p className="text-sm mb-2">From: {selectedEmail.from?.emailAddress?.name}</p>
            <div dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content }} />
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
