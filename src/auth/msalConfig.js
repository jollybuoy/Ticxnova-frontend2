import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "23b268a2-08ce-4b76-b3b4-46c89ab7d254", // ✅ Use your actual client ID
    authority: "https://login.microsoftonline.com/91dce830-003d-4d46-abfc-4fe21dfab134", // ✅ Your Azure tenant ID
    redirectUri: "https://yellow-dune-0ed10881e.6.azurestaticapps.net/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: [
    "User.Read",
    "Mail.Read",
    "Mail.ReadWrite",
    "Mail.Send",
    "User.ReadBasic.All",
    "User.Read.All",
    "User.ReadWrite.All",
    "Files.Read.All",
    "Sites.Read.All"
  ]
};
