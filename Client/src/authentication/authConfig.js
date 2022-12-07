export const msalConfig = {
    auth: {
        clientId: '3b24c959-141c-4d65-ac99-96b41c33f438',
        authority: 'https://login.microsoftonline.com/d959b97f-9c0b-4f25-873b-27048484151a',
        redirectUri: 'http://localhost:3000',
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false // Set this to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
    }
};

export const loginRequest  = {
    scopes: ["https://airbnbac.onmicrosoft.com/api/login_user"]
};