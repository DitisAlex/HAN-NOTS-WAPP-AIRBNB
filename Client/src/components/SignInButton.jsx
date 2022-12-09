import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authentication/authConfig";
import Nav from "react-bootstrap/Nav";

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log(e);
      });
    }
  };
  return <Nav.Link onClick={() => handleLogin("popup")}>Sign In</Nav.Link>;
};
