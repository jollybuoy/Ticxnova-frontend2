// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

// Show loading spinner until MSAL finishes
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Optional: Show a loader while waiting
const showLoader = () => {
  root.render(
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
      Loading authentication...
    </div>
  );
};

showLoader();

msalInstance
  .handleRedirectPromise()
  .then((authResult) => {
    if (authResult) {
      console.log("MSAL login success:", authResult);
    } else {
      console.log("No redirect login detected, continuing...");
    }

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

    root.render(
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Authentication error: {error.message}
      </div>
    );
  });
