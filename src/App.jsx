import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import axios from "./api/axios";

// Pages & Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import AllTickets from "./pages/AllTickets";
import MainLayout from "./components/MainLayout";
import TicketDetails from "./pages/TicketDetails";
import AIChatBot from "./components/AIChatBot";
import Reports from "./pages/Reports";
import KnowledgeBase from "./pages/KnowledgeBase";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import SlaTracker from "./pages/SlaTracker";
import AssetManagement from "./pages/AssetManagement";
import EmailTemplates from "./pages/EmailTemplates";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactAdmin from "./pages/ContactAdmin";

function App() {
  const { instance, accounts } = useMsal();
  const msalAuthenticated = useIsAuthenticated();

  const [customAuth, setCustomAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [msUserDetails, setMsUserDetails] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // Access token for Graph API calls

  const userToken = localStorage.getItem("token");
  const user = accounts[0] || null;

  useEffect(() => {
    setCustomAuth(!!userToken);
    setLoading(false);
  }, [userToken, msalAuthenticated]);

  useEffect(() => {
    const fetchMicrosoftUserDetails = async () => {
      try {
        // Acquire token with all necessary scopes
        const response = await instance.acquireTokenSilent({
          scopes: [
            "User.Read",         // Read the authenticated user's profile
            "User.ReadBasic.All", // Read profiles of other users
            "Files.ReadWrite",   // Access files on OneDrive
            "Mail.Read",         // Read user emails
            "Mail.Send"          // Send emails on behalf of the user
          ],
          account: accounts[0],
        });

        setAccessToken(response.accessToken); // Save access token for child components

        const graphResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me?$select=displayName,jobTitle,department,mail`,
          {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          }
        );

        if (!graphResponse.ok) {
          throw new Error("Failed to fetch user profile details");
        }

        const userData = await graphResponse.json();

        console.log("🧠 User Profile Data:", userData);

        // Save user details to state
        setMsUserDetails({
          name: userData.displayName, // Name of the user
          designation: userData.jobTitle || "Not Available", // Job title (designation)
          department: userData.department || "Not Available", // Department
          email: userData.mail, // Email address
        });

        // Optional: Save to backend if needed
        await axios.post("/auth/microsoft-login", {
          email: userData.mail,
          name: userData.displayName,
          designation: userData.jobTitle,
          department: userData.department || "General",
        });
      } catch (err) {
        console.error("❌ Error fetching user profile details:", err);
      }
    };

    if (msalAuthenticated) {
      fetchMicrosoftUserDetails();
    }
  }, [msalAuthenticated, instance, accounts]);

  const handleLogin = () => {
    instance
      .loginRedirect({
        scopes: [
          "User.Read",         // Read the authenticated user's profile
          "User.ReadBasic.All", // Read profiles of other users
          "Files.ReadWrite",   // Access files on OneDrive
          "Mail.Read",         // Read user emails
          "Mail.Send"          // Send emails on behalf of the user
        ],
      })
      .catch((err) => {
        console.error("Microsoft login failed:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (msalAuthenticated) {
      instance.logoutRedirect();
    } else {
      setCustomAuth(false);
    }
  };

  const isAuthenticated = msalAuthenticated || customAuth;
  const activeUser = msUserDetails || user;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="relative">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setAuth={setCustomAuth} handleLogin={handleLogin} />
              )
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact-admin" element={<ContactAdmin />} />

          {/* Authenticated Routes */}
          {isAuthenticated && (
            <Route element={<MainLayout user={activeUser} handleLogout={handleLogout} />}>
              <Route path="/dashboard" element={<Dashboard user={activeUser} />} />
              <Route path="/create-ticket" element={<CreateTicket user={activeUser} />} />
              <Route path="/all-tickets" element={<AllTickets user={activeUser} />} />
              <Route path="/ticket/:id" element={<TicketDetails user={activeUser} />} />
              <Route path="/reports" element={<Reports user={activeUser} />} />
              <Route path="/knowledgebase" element={<KnowledgeBase user={activeUser} accessToken={accessToken} />} />
              <Route path="/notifications" element={<Notifications user={activeUser} />} />
              <Route path="/users" element={<Users user={activeUser} />} />
              <Route path="/messages" element={<Messages user={activeUser} />} />
              <Route path="/settings" element={<Settings user={activeUser} />} />
              <Route path="/adminpanel" element={<AdminPanel user={activeUser} />} />
              <Route path="/slatracker" element={<SlaTracker user={activeUser} />} />
              <Route path="/assetmanagement" element={<AssetManagement user={activeUser} />} />
              <Route path="/emailtemplates" element={<EmailTemplates user={activeUser} />} />
              <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
        </Routes>

        {/* AI ChatBot */}
        {isAuthenticated && (
          <>
            <button
              className="fixed bottom-5 right-5 z-50"
              onClick={() => setShowAI(true)}
              aria-label="Open Ticxnova AI"
            >
              <div className="relative w-28 h-28 group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 opacity-40 blur-lg animate-pulse" />
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-700 rounded-full shadow-2xl flex items-center justify-center animate-spin-slow relative z-10">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white text-xl">🤖</div>
                  <div className="absolute top-2 left-0 w-full text-center">
                    <span className="text-white text-sm font-semibold drop-shadow-lg tracking-wide bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-bounce">
                      Ticxnova AI
                    </span>
                  </div>
                  <span className="text-4xl">🧠</span>
                </div>
              </div>
            </button>
            <AIChatBot isOpen={showAI} onClose={() => setShowAI(false)} token={userToken || user?.idToken} />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
