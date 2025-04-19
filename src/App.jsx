import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./auth/msalConfig";

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

const AuthWrapper = ({ children }) => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      instance.loginRedirect(loginRequest);
    } else if (accounts.length > 0) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          localStorage.setItem("token", response.idToken);
        });
    }
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to Microsoft login...</div>;
  }

  return children;
};

function App() {
  const [showAI, setShowAI] = useState(false);
  const userToken = localStorage.getItem("token");

  return (
    <AuthWrapper>
      <Router>
        <div className="relative">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/all-tickets" element={<AllTickets />} />
              <Route path="/ticket/:id" element={<TicketDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/knowledgebase" element={<KnowledgeBase />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<Users />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/adminpanel" element={<AdminPanel />} />
              <Route path="/slatracker" element={<SlaTracker />} />
              <Route path="/assetmanagement" element={<AssetManagement />} />
              <Route path="/emailtemplates" element={<EmailTemplates />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>

          {/* ✅ Ticxnova AI Bot Button */}
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

          <AIChatBot isOpen={showAI} onClose={() => setShowAI(false)} token={userToken} />
        </div>
      </Router>
    </AuthWrapper>
  );
}

export default App;
