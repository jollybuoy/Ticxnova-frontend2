// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/msalConfig";

// MSAL Instance
const msalInstance = new PublicClientApplication(msalConfig);

// Ensure MSAL handles redirect flow before rendering
msalInstance
  .handleRedirectPromise()
  .then(() => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("MSAL redirect error:", error);
  });
