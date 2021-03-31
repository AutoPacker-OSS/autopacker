import { Button, Result } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Complete(props) {
	const { setupInfo, uploadSuccess } = props.values;

	// Redux state
	const projectName = sessionStorage.getItem("selectedProjectName");

	return uploadSuccess ? (
		<Result
			status="success"
			title={
				'Successfully added the module "' +
				setupInfo.name +
				'" to the project: ' +
				projectName
			}
			extra={[
				<Button type="primary" key="console">
					<Link to="/profile/projects">My Projects</Link>
				</Button>,
			]}
		/>
	) : (
		<Result
			status="error"
			title={
				'Failed to add the module "' + setupInfo.name + '" to the project: ' + projectName
			}
			extra={[
				<Button type="primary" key="console">
					<Link to="/profile/projects">My Projects</Link>
				</Button>,
			]}
		/>
	);
}

export default Complete;
