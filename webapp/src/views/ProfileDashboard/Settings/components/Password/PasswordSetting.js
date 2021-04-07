import React from "react";
import { useDispatch } from "react-redux";
import { Typography, Divider, Form, Button, Input } from "antd";
import { createAlert } from "../../../../../store/actions/generalActions";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

function PasswordSetting() {
	// State
	const [oldPassword, setOldPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	// Validation
	const [validNewPassword, setValidNewPassword] = React.useState("");
	const [validConfirmPassword, setValidConfirmPassword] = React.useState("");

	// Import sub components from antd
	const { Title } = Typography;

	const [keycloak] = useKeycloak();

	const dispatch = useDispatch();

	const validatePassword = (value) => {
		setNewPassword(value);
		if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)) {
			setValidNewPassword("success");
			if (value === confirmPassword && validConfirmPassword !== "success") {
				setValidConfirmPassword("success");
			} else {
				setValidConfirmPassword("error");
			}
		} else if (value.trim().length === 0) {
			setValidNewPassword("");
			if (confirmPassword.trim().length === 0) {
				setValidConfirmPassword("");
			}
		} else {
			setValidNewPassword("error");
			if (confirmPassword.trim().length > 0) {
				setValidConfirmPassword("error");
			}
		}
	};

	const validateConfirmPassword = (value) => {
		setConfirmPassword(value);
		if (newPassword === value && validNewPassword === "success") {
			setValidConfirmPassword("success");
		} else if (value.trim().length === 0) {
			setValidConfirmPassword("");
		} else {
			setValidConfirmPassword("error");
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (oldPassword.length >= 8 || validNewPassword === "success" || validConfirmPassword === "success") {
			axios({
				method: "post",
				url: process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + "/auth/changePassword",
				headers: {
					Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
				},
				data: {
					oldPassword: oldPassword,
					newPassword: newPassword,
					confirmPassword: confirmPassword,
				},
			})
				.then(() => {
					dispatch(createAlert("Password changed", "Password has successfully been changed", "success", true));
					setOldPassword("");
					setNewPassword("");
					setConfirmPassword("");
				})
				.catch(() => {
					dispatch(createAlert("Password change failed", "Couldn't change password", "warning", true));
				});
		}
	};

	return (
		<div>
			<Title level={2}>
				Change password
				<Divider style={{ marginTop: 10 }} />
				<Form layout="vertical">
					<Form.Item
						label="Old password:"
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							maxWidth: 400,
							marginBottom: 10,
						}}
					>
						<Input
							style={{ marginTop: 5 }}
							disabled
							type="password"
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</Form.Item>
					<Form.Item
						hasFeedback
						validateStatus={validNewPassword}
						label="New password:"
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							maxWidth: 400,
							marginBottom: 10,
						}}
					>
						<Input
							style={{ marginTop: 5 }}
							disabled
							type="password"
							onChange={(e) => {
								setValidNewPassword("validating");
								validatePassword(e.target.value);
							}}
						/>
						<p style={{ lineHeight: 1.5, marginBottom: 0 }}>
							Make sure the password is at least {/* TODO Set conditional coloring */}
							<span
								style={{
									color: validNewPassword === "success" ? "green" : "red",
								}}
							>
								8 characters long, including a number and one lower- and uppercase letter
							</span>
						</p>
					</Form.Item>
					<Form.Item
						hasFeedback
						validateStatus={validConfirmPassword}
						label="Confirm password:"
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							maxWidth: 400,
						}}
					>
						<Input
							style={{ marginTop: 5 }}
							disabled
							type="password"
							onChange={(e) => {
								setValidConfirmPassword("validating");
								validateConfirmPassword(e.target.value);
							}}
						/>
						<p style={{ lineHeight: 1.5, marginBottom: 0 }}>
							Make sure the two {/* TODO Set conditional coloring */}
							<span
								style={{
									color: validConfirmPassword === "success" ? "green" : "red",
								}}
							>
								passwords matches
							</span>
						</p>
					</Form.Item>

					<div style={{ width: "100%", textAlign: "center" }} onClick={(e) => handleSubmit(e)}>
						<Button
							disabled={
								true
								// oldPassword.length < 8 || validNewPassword !== "success" || validConfirmPassword !== "success"
							}
							type="primary"
						>
							Update password
						</Button>
						<Button disabled type="link" onClick={(e) => e.preventDefault()}>
							I forgot my password
						</Button>
					</div>
				</Form>
			</Title>
		</div>
	);
}

export default PasswordSetting;
