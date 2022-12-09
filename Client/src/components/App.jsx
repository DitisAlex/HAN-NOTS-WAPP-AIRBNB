import React, { useState } from "react";
import { PageLayout } from "./PageLayout";
import Home from "./Home";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../authentication/authConfig";
import Button from "react-bootstrap/Button";
import { accessToken } from "mapbox-gl";

export default function App() {
  return (
    <div>
      <PageLayout>
        <AuthenticatedTemplate>
          <p>You are signed in!</p>
          <ProfileContent />
          <Home accessToken={accessToken} />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <p>You are not signed in! Please sign in.</p>
        </UnauthenticatedTemplate>
      </PageLayout>
    </div>
  );
}

function ProfileContent() {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState(null);

  const name = accounts[0] && accounts[0].name;

  function RequestAccessToken() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        console.log(response.accessToken);
        setAccessToken(response.accessToken);
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          setAccessToken(response.accessToken);
        });
      });
  }

  return (
    <>
      <h5 className="card-title">Welcome {name}</h5>
      {accessToken ? (
        <p>Access Token Acquired!</p>
      ) : (
        <Button variant="secondary" onClick={RequestAccessToken}>
          Request Access Token
        </Button>
      )}
    </>
  );
}
