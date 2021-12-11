const OKTA_DOMAIN = process.env.REACT_APP_OKTA_DOMAIN;
const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID;
const CALLBACK_PATH = '/login/callback';

const ISSUER = `https://${OKTA_DOMAIN}/oauth2/default`;
const HOST = window.location.host;
const REDIRECT_URI = `http://${HOST}${CALLBACK_PATH}`;
const SCOPES = 'openid profile email';

export const oktaConfig = {
    issuer: ISSUER,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: SCOPES.split(/\s+/)
};
