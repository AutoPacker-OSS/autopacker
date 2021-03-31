import React, { useCallback } from "react";
import { withRouter } from "react-router-dom";

import { withKeycloak } from "@react-keycloak/web";

const LoginBtn = withRouter(
	withKeycloak(({ keycloak }) => {
		const login = useCallback(() => {
			keycloak.login();
		}, [keycloak]);

		return <div onClick={login}>Sign in</div>;
	})
);

export default LoginBtn;
