import { useState, useEffect } from "react";
import axios from "axios";

import {useOktaAuth} from "@okta/okta-react";

// TODO Make this work! :D
export default function useAxios(servicePort) {
	const { authState } = useOktaAuth();
	const [axiosInstance, setAxiosInstance] = useState({});

	useEffect(() => {
		const instance = axios.create({
			baseURL: process.env.REACT_APP_APPLICATION_URL + servicePort,
			headers: {
				Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
			},
		});

		setAxiosInstance({ instance });

		return () => {
			setAxiosInstance({});
		};
	}, [servicePort, keycloak, authState.accessToken]);

	return axiosInstance.instance;
}
