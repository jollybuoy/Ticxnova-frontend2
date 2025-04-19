import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "147aaa02-15de-4717-bd44-fb43a7468fa0",
    authority: "https://login.microsoftonline.com/91dce830-003d-4d46-abfc-4fe21dfab134",
    redirectUri: "https://yellow-dune-0ed10881e.6.azurestaticapps.net/auth/callback"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["User.Read"]
};
