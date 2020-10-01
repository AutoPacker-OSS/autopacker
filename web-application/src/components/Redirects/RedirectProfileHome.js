import React from "react";
import { Redirect } from "react-router-dom";

/**
 * Returns JSX that redirects the user to the profile dashboard
 */
function RedirectProfileHome() {
	return <Redirect to="/profile/projects" />;
}

export default RedirectProfileHome;
