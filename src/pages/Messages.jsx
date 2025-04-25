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
      {/* ...UI code unchanged... */}
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
