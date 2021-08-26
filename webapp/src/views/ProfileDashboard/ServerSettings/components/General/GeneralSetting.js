import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { Typography, Button, Input, Divider, Modal } from "antd";
import { createAlert } from "../../../../../store/actions/generalActions";
import {useOktaAuth} from "@okta/okta-react";
import axios from "axios";

function GeneralSetting(props) {
	// State
	const [showModal, setModalVisible] = React.useState(false);
	const [verifiedDelete, setVerifiedDelete] = React.useState(false);
	const [redirect, setRedirect] = React.useState(false);

	const { authState } = useOktaAuth();

	const { Title, Text } = Typography;
	const server = props.server;

	// Get state from redux store
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
		// TODO UNCOMMENT THIS AND FIX THIS SHIT
		// if (keycloak.idTokenParsed.email_verified) {
		// 	axios({
		// 		method: "delete",
		// 		url:
		// 			process.env.REACT_APP_APPLICATION_URL +
		// 			process.env.REACT_APP_API +
		// 			"/server/delete/" +
		// 			server.owner +
		// 			"/" +
		// 			server.serverId,
		// 		headers: {
		// 			Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
		// 		},
		// 	})
		// 		.then(() => {
		// 			dispatch(
		// 				createAlert(
		// 					"Server successfully deleted",
		// 					server.title + " has successfully been deleted.",
		// 					"success",
		// 					true
		// 				)
		// 			);
		// 			setRedirect(true);
		// 		})
		// 		.catch(() => {
		// 			dispatch(
		// 				createAlert("Server deletion failed", "Failed to delete the given server: " + server.title, "error", true)
		// 			);
		// 		});
		// }
	}

	return (
		<div>
			{redirect ? <Redirect to="/profile/servers" /> : <div />}
			<Title style={{ color: "red" }} level={2}>
				Delete Server
				<Divider style={{ marginTop: 10 }} />
			</Title>
			<Text>
				Deleting your server is a irreversible action. You will lose all data and projects associated with the server.
			</Text>
			<br />
			<Button
				style={{ marginTop: 10 }}
				type="danger"
				onClick={() => {
					setModalVisible(true);
				}}
			>
				Delete server
			</Button>{" "}
			<Modal
				title="Delete server"
				visible={showModal}
				okButtonProps={{ disabled: !verifiedDelete }}
				onOk={() => sendRequest()}
				okType="danger"
				onCancel={() => setModalVisible(false)}
			>
				<p>This action cannot be undone. This will permanently delete this server, and all associations.</p>
				<p>Please type "delete" to confirm.</p>
				<Input onChange={(event) => handleInput(event.target.value)}/>
			</Modal>
		</div>
	);
}

export default GeneralSetting;
