// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/msalConfig";
import axios from "axios";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);
const root = ReactDOM.createRoot(document.getElementById("root"));

// Temporary loading UI
const showLoading = (message = "Loading...") => {
  root.render(
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-white bg-gray-900">
      {message}
    </div>
  );
};

showLoading();

async function renderApp() {
  try {
    // MSAL initialization
    await msalInstance.initialize();

    // Handle redirect
    const response = await msalInstance.handleRedirectPromise();

    // Auto-register Microsoft user in backend and get JWT
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/auth/microsoft-login",
        {
          name: account.name,
          email: account.username,
        }
      );

      localStorage.setItem("token", res.data.token);
    }

    // Render the app
    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("❌ MSAL Initialization Error:", error);
    root.render(
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold bg-black">
        Authentication error: {error.message}
      </div>
    );
  }
}

renderApp();
