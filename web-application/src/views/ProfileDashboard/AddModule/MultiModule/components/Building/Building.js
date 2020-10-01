import { Col, Icon, Row, Spin } from "antd";
import React, { useEffect } from "react";

function Building() {
	// Get methods from props
	//const { nextStep, setUploadSuccess } = props.methods;

	// Get value from props
	//const { setupInfo, file } = props.values;

	// Redux state
	//const username = useSelector((state) => state.auth.username);
	//const projectName = useSelector((state) => state.general.selectedProjectName);

	useEffect(() => {
		// TODO Undo when this section is finished
		/* const url =
			process.env.REACT_APP_APPLICATION_URL +
			process.env.REACT_APP_FILE_DELIVERY_API +
			"/projects/" +
			username +
			"/" +
			projectName +
			"/" +
			setupInfo.name +
			"/add";

		let formData = new FormData();
		formData.append("config-type", setupInfo.language + "-" + setupInfo.version);
		formData.append("module-file", file[0]);

		fetch(url, {
			method: "POST",
			credentials: "include",
			body: formData,
		})
			.then((res) => {
				nextStep();
				setUploadSuccess(true);
			})
			.catch((err) => {
				nextStep();
				setUploadSuccess(false);
			}); */
		// TODO Make it work with axios
		/* axiosRequest(
			"post",
			url,
			{
				"Content-Type": "multipart/form-data"
			},
			{
				formData
			},
			response => {
				
			},
			err => {
				
			}
		); */
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
						indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
					/>
				</Col>
			</Row>
		</div>
	);
}

export default Building;
