// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);
const root = ReactDOM.createRoot(document.getElementById("root"));

const showLoading = (message = "Loading...") => {
  root.render(
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
      {message}
    </div>
  );
};

showLoading();

async function renderApp() {
  try {
    // ✅ REQUIRED for MSAL v3+
    await msalInstance.initialize();

    await msalInstance.handleRedirectPromise();

    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("MSAL Initialization Error:", error);
    root.render(
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Authentication error: {error.message}
      </div>
    );
  }
}

renderApp();
