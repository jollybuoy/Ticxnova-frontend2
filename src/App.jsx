import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "./api/axios";

// Pages & Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import AllTickets from "./pages/AllTickets";
import EnhancedLayout from "./components/EnhancedLayout";
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
import DemoPreview from "./pages/DemoPreview";

// Enhanced Components
import AdvancedDashboard from "./components/AdvancedDashboard";
import FloatingActionButton from "./components/FloatingActionButton";
import NotificationToast from "./components/NotificationToast";
import LoadingSpinner from "./components/LoadingSpinner";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const { instance, accounts } = useMsal();
  const msalAuthenticated = useIsAuthenticated();

  const [customAuth, setCustomAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [msUserDetails, setMsUserDetails] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [pageTransition, setPageTransition] = useState(false);

  const { notifications, addNotification, removeNotification } = useNotifications();

  const userToken = localStorage.getItem("token");
  const user = accounts[0] || null;

  useEffect(() => {
    setCustomAuth(!!userToken);
    setLoading(false);
  }, [userToken, msalAuthenticated]);

  useEffect(() => {
    const fetchMicrosoftUserDetails = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: [
            "User.Read",
            "User.ReadBasic.All",
            "Files.ReadWrite",
            "Mail.Read",
            "Mail.Send"
          ],
          account: accounts[0],
        });

        setAccessToken(response.accessToken);

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

        setMsUserDetails({
          name: userData.displayName,
          designation: userData.jobTitle || "Not Available",
          department: userData.department || "Not Available",
          email: userData.mail,
        });

        await axios.post("/auth/microsoft-login", {
          email: userData.mail,
          name: userData.displayName,
          designation: userData.jobTitle,
          department: userData.department || "General",
        });

        // Welcome notification
        addNotification({
          type: 'success',
          title: 'Welcome back!',
          message: `Hello ${userData.displayName}, you're successfully logged in.`,
          duration: 4000
        });
      } catch (err) {
        console.error("❌ Error fetching user profile details:", err);
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'Failed to fetch user profile details.',
          duration: 5000
        });
      }
    };

    if (msalAuthenticated) {
      fetchMicrosoftUserDetails();
    }
  }, [msalAuthenticated, instance, accounts, addNotification]);

  const handleLogin = () => {
    instance
      .loginRedirect({
        scopes: [
          "User.Read",
          "User.ReadBasic.All",
          "Files.ReadWrite",
          "Mail.Read",
          "Mail.Send"
        ],
      })
      .catch((err) => {
        console.error("Microsoft login failed:", err);
        addNotification({
          type: 'error',
          title: 'Login Failed',
          message: 'Microsoft authentication failed. Please try again.',
          duration: 5000
        });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (msalAuthenticated) {
      instance.logoutRedirect();
    } else {
      setCustomAuth(false);
    }
    addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
      duration: 3000
    });
  };

  const isAuthenticated = msalAuthenticated || customAuth;
  const activeUser = msUserDetails || user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="large" text="Initializing Ticxnova..." />
      </div>
    );
  }

  return (
    <Router>
      <div className="relative">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Login setAuth={setCustomAuth} handleLogin={handleLogin} />
                  </motion.div>
                )
              }
            />
            
            {/* Demo Preview Route - No Authentication Required */}
            <Route path="/demo" element={<DemoPreview />} />
            
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact-admin" element={<ContactAdmin />} />

            {/* Authenticated Routes */}
            {isAuthenticated && (
              <Route element={<EnhancedLayout user={activeUser} handleLogout={handleLogout} />}>
                <Route path="/dashboard" element={<AdvancedDashboard user={activeUser} />} />
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
        </AnimatePresence>

        {/* Enhanced AI ChatBot */}
        {isAuthenticated && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-5 right-5 z-50"
              onClick={() => setShowAI(true)}
              aria-label="Open Ticxnova AI"
            >
              <div className="relative w-32 h-32 group">
                {/* Animated Rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 opacity-20 blur-xl animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-30 blur-lg animate-ping" />
                
                {/* Main Button */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full shadow-2xl flex items-center justify-center relative z-10 border-4 border-white/20"
                >
                  {/* AI Icon */}
                  <div className="text-center">
                    <div className="text-4xl mb-1">🧠</div>
                    <div className="text-white text-xs font-bold tracking-wider">
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent"
                      >
                        TICXNOVA AI
                      </motion.span>
                    </div>
                  </div>
                  
                  {/* Floating Particles */}
                  <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-300 rounded-full animate-bounce" />
                  <div className="absolute top-4 right-3 w-1 h-1 bg-pink-300 rounded-full animate-pulse" />
                  <div className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
                </motion.div>
              </div>
            </motion.button>
            
            <AIChatBot 
              isOpen={showAI} 
              onClose={() => setShowAI(false)} 
              token={userToken || user?.idToken} 
            />
            
            {/* Floating Action Button */}
            <FloatingActionButton />
          </>
        )}

        {/* Notification System */}
        <NotificationToast 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
      </div>
    </Router>
  );
}

export default App;