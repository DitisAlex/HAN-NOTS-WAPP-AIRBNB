import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authentication/authConfig";
import Button from "react-bootstrap/Button";


/**
 * Renders a button which, when selected, will open a popup for login
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    return (
        <Button variant="secondary" className="ml-auto" onClick={() => handleLogin("popup")}>Sign in using Popup</Button>
    );
}