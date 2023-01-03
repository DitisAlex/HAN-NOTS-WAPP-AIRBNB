import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authentication/authConfig";
import "./web.config";

const msalInstance = new PublicClientApplication(msalConfig);

const root = createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
