import { Button, Form, Input, Layout, PageHeader, Tooltip, Typography, Spin } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { createAlert } from "../../../store/actions/generalActions";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import { QuestionCircleOutlined, LoadingOutlined } from "@ant-design/icons";

function NewServer() {
	// State
	const [title, setTitle] = React.useState("");
	const [desc, setDesc] = React.useState("");
	const [ip, setIp] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [sshKey, setSSHKey] = React.useState("");
	const [radioChecked, setRadioChecked] = React.useState(false);
	// Conditional rendering
	const [sshEnabled, setSSHEnabled] = React.useState(false);
	const [redirect, setRedirect] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	// validation
	const [validName, setValidName] = React.useState(false);
	const [validIp, setValidIp] = React.useState(false);
	const [nameValidStatus, setNameValidStatus] = React.useState("");
	const [ipValidStatus, setIpValidStatus] = React.useState("");
	const [nameHelpText, setNameHelpText] = React.useState("");
	const [ipHelpText, setIpHelpText] = React.useState("");

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { TextArea } = Input;

	const [keycloak] = useKeycloak();

	const dispatch = useDispatch();

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		},
	};

	const routes = [
		{
			path: "/profile",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/servers",
			breadcrumbName: "Your Servers",
		},
		{
			path: "/add",
			breadcrumbName: "Add Server",
		},
	];

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
		if (keycloak.idTokenParsed.email_verified) {
			axios({
				method: "post",
				url:
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_SERVER_MANAGER +
					"/server/new-server",
				headers: {
					Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
				},
				data: {
					title: title,
					desc: desc,
					ip: ip,
					username: username,
					ssh: sshKey,
				},
			})
				.then(() => {
					dispatch(
						createAlert(
							"Server Added",
							"Server has been successfully added. You can now add projects you wish to deploy to the server",
							"success",
							true
						)
					);
					setLoading(false);
					setRedirect(true);
				})
				.catch(() => {
					dispatch(
						createAlert(
							"Failed to add server",
							"You can't name the server the same as another server",
							"error",
							true
						)
					);
					setLoading(false);
				});
		} else {
			dispatch(
				createAlert(
					"Adding Server failed",
					"You can't add a server without verifying your account. Please check your email inbox for a verification email, and follow the instructions.",
					"warning",
					true
				)
			);
		}
	};

	const validateName = (value) => {
		if (value.trim().length <= 0) {
			setValidName(false);
			setNameValidStatus("error");
			setNameHelpText("Please name your project");
		} else if (/^[a-zA-Z0-9-]+$/.test(value)) {
			setValidName(true);
			setNameValidStatus("success");
			setNameHelpText("");
		} else {
			setValidName(false);
			setNameValidStatus("error");
			setNameHelpText(
				"Only letters, numbers and dashes are allowed. Spaces and special characters not allowed"
			);
		}
		setTitle(value);
	};

	const validationIp = (ipAdress) => {
		const ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

		if (ipAdress.trim().length <= 0) {
			setValidIp(false);
			setIpValidStatus("error");
			setIpHelpText("Please enter a IP address");
		} else if (ipAdress.match(ipFormat)) {
			setValidIp(true);
			setIpValidStatus("success");
			setIpHelpText("");
		} else {
			setValidIp(false);
			setIpValidStatus("error");
			setIpHelpText(
				"Only a valid IP is allowed"
			);
		}
		setIp(ipAdress);
	};



	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Add Server"
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
			>
				<Paragraph>Fill in the form below to add a new server</Paragraph>
			</PageHeader>
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
					minHeight: 280,
				}}
			>
				{redirect ? <Redirect to="/profile/servers" /> : <div />}
				<Form {...formItemLayout}>
					<Form.Item
						name="serverTitle"
						label="Server Title"
						hasFeedback
						validateStatus={nameValidStatus}
						help={nameHelpText}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input onChange={(e) => validateName(e.target.value)} />
					</Form.Item>
					<Form.Item
						label="Server Description"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					>
						<TextArea id="server-description" onChange={(e) => setDesc(e.target.value)} />
					</Form.Item>
					<Form.Item
						name="ipAddress"
						label={
							<span>
								IP Address&nbsp;
								<Tooltip title="Servers' IP address">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						validateStatus={ipValidStatus}
						help={ipHelpText}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
								message: "Please specify the servers' ip address",
							},
						]}
					>
						<Input onChange={(e) => validationIp(e.target.value)} />
					</Form.Item>
					<Form.Item
						name="username"
						label={
							<span>
								Username&nbsp;
								<Tooltip title="Username for accessing the server">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
								message: "Please specify the username",
							},
						]}
					>
						<Input onChange={(e) => setUsername(e.target.value)} />
					</Form.Item>
					{/* // TODO Uncomment when SSH key feature is implemented */}
					{/* <Form.Item
						label="SSH?"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					>
						<Radio.Group>
							<Radio
								value="yes"
								onChange={() => {
									setRadioChecked(true);
									setSSHEnabled(true);
								}}
							>
								Yes
							</Radio>
							<Radio
								c
								value="no"
								onChange={() => {
									setRadioChecked(true);
									setSSHEnabled(false);
								}}
							>
								no
							</Radio>
						</Radio.Group>
					</Form.Item> */}
					{sshEnabled ? (
						<Form.Item
							label="SSH Key"
							style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						>
							<TextArea onChange={(e) => setSSHKey(e.target.value)} />
						</Form.Item>
					) : (
						<div />
					)}
					<div
						style={{ width: "100%", textAlign: "center" }}
						onClick={(e) => handleSubmit(e)}
					>
						{loading ? (
							<div>
								<Spin
									style={{
										width: "100%",
										marginLeft: "auto",
										marginRight: "auto",
										marginBottom: 10,
									}}
									indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
								/>
								<p>This might take a while. Please be patient...</p>
							</div>
						) : (
							<Button
								id="create-server-btn"
								disabled={
									!validName || !validIp || username.length <= 0
									// || !radioChecked
								}
								type="primary"
							>
								Add Server
							</Button>
						)}
					</div>
				</Form>
			</Content>
		</div>
	);
}

export default NewServer;
