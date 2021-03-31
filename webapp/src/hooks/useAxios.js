import { useState, useEffect } from "react";
import axios from "axios";

import { useKeycloak } from "@react-keycloak/web";

// TODO Make this work! :D
export default function useAxios(servicePort) {
	const [keycloak] = useKeycloak();
	const [axiosInstance, setAxiosInstance] = useState({});

	useEffect(() => {
		const instance = axios.create({
			baseURL: process.env.REACT_APP_APPLICATION_URL + servicePort,
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		});

		setAxiosInstance({ instance });

		return () => {
			setAxiosInstance({});
		};
	}, [servicePort, keycloak, keycloak.token]);

	return axiosInstance.instance;
}
