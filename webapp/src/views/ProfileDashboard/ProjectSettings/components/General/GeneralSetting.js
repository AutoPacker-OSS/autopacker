import React, {useContext} from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { Typography, Button, Input, Divider, Modal } from "antd";
import { createAlert } from "../../../../../store/actions/generalActions";
import {useOktaAuth} from "@okta/okta-react";
import axios from "axios";
import {useApi} from "../../../../../hooks/useApi";
import { useAuth0 } from "@auth0/auth0-react";

function GeneralSetting(props) {
	// State
	const [showModal, setModalVisible] = React.useState(false);
	const [verifiedDelete, setVerifiedDelete] = React.useState(false);
	const [redirect, setRedirect] = React.useState(false);

	const { Title, Text } = Typography;
	const owner = props.project.owner;
	const projectName = props.project.name;

	const { user, isAuthenticated, isLoading } = useAuth0();
	const {get, _delete} = useApi();

	const dispatch = useDispatch();

	function handleInput(event) {
		if (event === "delete") {
			setVerifiedDelete(true);
		} else {
			setVerifiedDelete(false);
		}
	}

	function sendRequest() {
		setModalVisible(false);
		if (user.email_verified) {
			_delete(`/projects/${owner.username}/${projectName}`, {
				username: owner.username,
				projectName: projectName,
			}).then(() => {
				dispatch(
					createAlert(
						"Project successfully deleted",
						projectName + " has successfully been deleted.",
						"success",
						true
					)
				);
				setRedirect(true);
			}).catch(() => {
					dispatch(
						createAlert(
							"Project deletion failed",
							"Failed to delete the given project: " + projectName,
							"error",
							true
						)
					);
				});
		}
	}

	return (
		<div>
			{redirect ? <Redirect to="/profile/projects" /> : <div />}
			<Title style={{ color: "red" }} level={2}>
				Delete Project
				<Divider style={{ marginTop: 10 }} />
			</Title>
			<Text>
				Deleting your project is a irreversible action. You will lose all data and modules associated with the project.
			</Text>
			<br />
			<Button
				id="delete-project-button"
				style={{ marginTop: 10 }}
				type="danger"
				onClick={() => {
					setModalVisible(true);
				}}
			>
				Delete project
			</Button>{" "}
			<Modal
				title="Delete project"
				visible={showModal}
				okButtonProps={{ disabled: !verifiedDelete }}
				onOk={() => sendRequest()}
				okType="danger"
				onCancel={() => setModalVisible(false)}
			>
				<p>This action cannot be undone. This will permanently delete this project, and all associations.</p>
				<p>Please type "delete" to confirm.</p>
				<Input onChange={(event) => handleInput(event.target.value)}/>
			</Modal>
		</div>
	);
}

export default GeneralSetting;
