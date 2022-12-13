import React, { useRef, useEffect, useState } from "react";
import { getStats } from "../serverCommunications";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
  useAccount,
} from "@azure/msal-react";
import { loginRequest } from "../authentication/authConfig";

export default function Charts(props) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };
    if (account) {
      instance.acquireTokenSilent(request).then((response) => {
        getStats(response.accessToken).then((response) => {
          console.log(response.data);
        });
      });
    }
  }, [account, instance]);

  return (
    <div className="container">
      <AuthenticatedTemplate>
        {account && account.idTokenClaims.roles[0] == "MyAppAdministratorsGroup"
          ? "Admin"
          : "You do not have enough permissions to view this page!"}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        You must be signed before you can view this page!
      </UnauthenticatedTemplate>
    </div>
  );
}
