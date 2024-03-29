import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated, useMsal, useAccount } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { loginRequest } from "../authentication/authConfig";

export default function Navbars(props) {
  const isAuthenticated = useIsAuthenticated();

  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };
    if (account) {
      instance.acquireTokenSilent(request);
    }
  }, [account, instance]);

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>Inside AirBNB</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Map</Nav.Link>
          <Nav.Link href="/charts">Charts</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        {isAuthenticated ? (
          <Nav>
            <Navbar.Text>
              Welcome, {account ? account.username : ""}
            </Navbar.Text>
            <SignOutButton />
          </Nav>
        ) : (
          <Nav>
            <SignInButton />
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
