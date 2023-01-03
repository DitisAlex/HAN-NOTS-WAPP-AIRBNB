export const msalConfig = {
  auth: {
    clientId: "44c4be7a-162a-4b57-bc2b-6858db722f53",
    authority:
      "https://login.microsoftonline.com/d959b97f-9c0b-4f25-873b-27048484151a",
    redirectUri: "https://airbnbac.azurewebsites.net", //http://localhost:3000
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
  },
};

export const loginRequest = {
  scopes: [
    "https://airbnbac.onmicrosoft.com/44c4be7a-162a-4b57-bc2b-6858db722f53/access",
  ],
};
