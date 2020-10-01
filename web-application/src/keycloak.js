import Keycloak from "keycloak-js";

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
	realm: "AutoPackerRealm",
	// Change url to localhost to work with local keycloak instance
	url: process.env.REACT_APP_KEYCLOAK_URL + "/auth/",
	clientId: "web-application",
});

export default keycloak;
