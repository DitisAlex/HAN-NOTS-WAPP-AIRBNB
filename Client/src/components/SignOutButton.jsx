import React from "react";
import { useMsal } from "@azure/msal-react";
import Nav from "react-bootstrap/Nav";

export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = (logoutType) => {
    if (logoutType === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    }
  };

  return <Nav.Link onClick={() => handleLogout("popup")}>Sign Out</Nav.Link>;
};
