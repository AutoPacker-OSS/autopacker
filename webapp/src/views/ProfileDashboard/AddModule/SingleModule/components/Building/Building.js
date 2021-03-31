import { Col, Row, Spin } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";
import { LoadingOutlined } from "@ant-design/icons";

function Building(props) {
	// Get methods from props
	const { nextStep, setUploadSuccess } = props.methods;

	// Get value from props
	const { setupInfo, file } = props.values;

	const [keycloak] = useKeycloak();

	const projectName = sessionStorage.getItem("selectedProjectName");

	useEffect(() => {
		const url =
			process.env.REACT_APP_APPLICATION_URL +
			process.env.REACT_APP_FILE_DELIVERY_API +
			"/projects/" +
			keycloak.idTokenParsed.preferred_username +
			"/" +
			projectName +
			"/" +
			setupInfo.name +
			"/add";

		let formData = new FormData();
		formData.append("desc", setupInfo.desc);
		formData.append("config-type", setupInfo["config-type"]);
		formData.append("config-params", '{ "port": ' + setupInfo.port + " }");
		formData.append("module-file", file[0]);

		fetch(url, {
			method: "POST",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			body: formData,
		})
			.then(() => {
				nextStep();
				setUploadSuccess(true);
			})
			.catch(() => {
				nextStep();
				setUploadSuccess(false);
			});
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
