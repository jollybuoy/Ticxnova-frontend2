// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/msalConfig";

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

    // Handle MSAL redirect login (Microsoft auth)
    await msalInstance.handleRedirectPromise();

    // Render the app with MSAL provider
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
