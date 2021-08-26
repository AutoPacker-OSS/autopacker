import { Col, Row, Spin } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {useOktaAuth} from "@okta/okta-react";
import { LoadingOutlined } from "@ant-design/icons";

function Building(props) {
	// Get methods from props
	const { nextStep, setUploadSuccess } = props.methods;

	// Get value from props
	const { setupInfo, file } = props.values;

	const { authState } = useOktaAuth();

	const projectName = sessionStorage.getItem("selectedProjectName");

	useEffect(() => {
		// TODO FIX THIS SHIT
		// const url =
		// 	process.env.REACT_APP_APPLICATION_URL +
		// 	process.env.REACT_APP_API +
		// 	"/projects/" +
		// 	keycloak.idTokenParsed.preferred_username +
		// 	"/" +
		// 	projectName +
		// 	"/" +
		// 	setupInfo.name +
		// 	"/add";
		//
		// let formData = new FormData();
		// formData.append("desc", setupInfo.desc);
		// formData.append("config-type", setupInfo["config-type"]);
		// formData.append("config-params", '{ "port": ' + setupInfo.port + " }");
		// formData.append("module-file", file[0]);
		//
		// fetch(url, {
		// 	method: "POST",
		// 	headers: {
		// 		Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
		// 	},
		// 	body: formData,
		// })
		// 	.then((response) => {
		// 		if (response.status === 200 || response.status === 201) {
		// 			setUploadSuccess(true);
		// 		} else {
		// 			setUploadSuccess(false);
		// 		}
		// 		nextStep();
		// 	})
		// 	.catch(() => {
		// 		nextStep();
		// 		setUploadSuccess(false);
		// 	});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Row>
				<Col xs={24}>
					<Spin
						style={{
							width: "100%",
							marginLeft: "auto",
							marginRight: "auto",
							marginTop: 30,
							marginBottom: 30,
						}}
						indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
					/>
				</Col>
			</Row>
		</div>
	);
}

export default Building;
