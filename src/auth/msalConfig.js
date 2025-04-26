import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "23b268a2-08ce-4b76-b3b4-46c89ab7d254", // ✅ Your App Client ID
    authority: "https://login.microsoftonline.com/91dce830-003d-4d46-abfc-4fe21dfab134", // ✅ Your Tenant ID
    redirectUri: "https://yellow-dune-0ed10881e.6.azurestaticapps.net/", // ✅ Your frontend hosted URL
  },
  cache: {
    cacheLocation: "localStorage", // ✅ Save tokens in localStorage (recommended)
    storeAuthStateInCookie: false  // ✅ Optional: set true only if older browsers (IE11 etc)
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: [
    "User.Read",          // ✅ Basic user profile
    "Mail.Read",          // ✅ Read user mails
    "Mail.ReadWrite",     // ✅ Read/Write user mails
    "Mail.Send",          // ✅ Send mails
    "User.ReadBasic.All", // ✅ Read basic profiles of other users
    "User.Read.All",      // ✅ Read full profile of all users
    "User.ReadWrite.All", // ✅ Read/write full profile of all users
    "Files.Read.All",     // ✅ Read OneDrive and SharePoint files
    "Sites.Read.All"      // ✅ Read SharePoint Sites info
  ]
};
