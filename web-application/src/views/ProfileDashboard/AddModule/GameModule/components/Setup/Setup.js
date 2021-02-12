import React, { useEffect } from "react";
import { Button, Form, Input, Radio, Typography, Select } from "antd";
// Import custom components
import { RightOutlined } from "@ant-design/icons";

function Setup(props) {
	// State (This needs to be returned to parent when clicking next)
	const [name, setName] = React.useState("");
	const [desc, setDesc] = React.useState("");
	const [port, setPort] = React.useState("");

	// State passed as props to component
	const [supportedGames, setSupportedGames] = React.useState([]);
	const [vanillaMinecraftServers, setVanillaMinecraftServers] = React.useState([]);
	// Selected Values
	const [selectedGame, setSelectedGame] = React.useState(null);
	const [selectedGameServer, setSelectedGameServer] = React.useState(null);
	const [selectedServerVersion, setSelectedServerVersion] = React.useState(null);

	// Selections
	const [frameworkTouched, setFrameworkTouched] = React.useState(false);
	const [isFramework, setIsFramework] = React.useState(false);

	// validation
	const [validName, setValidName] = React.useState(false);
	const [nameValidStatus, setNameValidStatus] = React.useState("");
	const [nameHelpText, setNameHelpText] = React.useState("");

	// Get methods from props
	const { nextStep, setSetupInfo } = props.methods;

	// Import sub components from antd
	const { TextArea } = Input;
	const { Paragraph } = Typography;
	const { Option } = Select;

	const handleNext = () => {
		if (!(name.length <= 0 || selectedGameServer === null || port.length < 4)) {
			let form = {
				name: name,
				desc: desc,
				gameServer: selectedGameServer.name,
				version: selectedServerVersion.version,
				"config-type": selectedServerVersion["config-type"],
				port: port,
			};
			setSetupInfo(form);
			// TODO Remove this console.log when implemented
			console.log(form);
			nextStep();
		}
	};

	useEffect(() => {
		// Create dummy list
		let supportedVanillaServers = [];

		let supportedGames = [
			{
				id: 0,
				name: "Minecraft",
				disabled: false,
				server_types: [
					{
						id: 1,
						name: "Vanilla Minecraft",
						versions: [
							{
								id: 1,
								version: "latest",
								"config-type": "vanilla-minecraft",
							},
						],
					},
					{
						id: 2,
						name: "FTB Infinity Evolved",
						versions: [
							{
								id: 2,
								version: "latest (1.7)",
								"config-type": "ftb-infinity-evolved",
							},
						],
					},
				],
			},
			{
				id: 1,
				name: "Factorio",
				disabled: false,
				server_types: [
					{
						id: 1,
						name: "Stable Builds",
						versions: [
							{
								id: 1,
								version: "Stable 1.1",
								"config-type": "factorio-stable",
							},
						],
					},
				],
			},
		];

		// Add dummy list to state on mount
		setSupportedGames(supportedGames);
		setVanillaMinecraftServers(supportedVanillaServers);
	}, []);

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

	const validateName = (value) => {
		if (value.trim().length <= 0) {
			setValidName(false);
			setNameValidStatus("error");
			setNameHelpText("Please name your module");
		} else if (/^[a-z0-9-]+$/.test(value)) {
			setValidName(true);
			setNameValidStatus("success");
			setNameHelpText("");
		} else {
			setValidName(false);
			setNameValidStatus("error");
			setNameHelpText(
				"Only lowercase letters, numbers and dashes are allowed. Spaces and special characters not allowed"
			);
		}
		setName(value);
	};

	const setGameWithName = (name) => {
		supportedGames.forEach((game) => {
			if (game.name == name) {
				setSelectedGame(game);
			}
		});
	};

	const setServerTypeWithName = (name) => {
		selectedGame.server_types.forEach((type) => {
			if (type.name == name) {
				setSelectedGameServer(type);
			}
		});
	};

	const setServerVersionWithName = (versionName) => {
		selectedGameServer.versions.forEach((versionObj) => {
			if (versionObj.version == versionName) {
				setSelectedServerVersion(versionObj);
			}
		});
	};

	return (
		<div>
			<Paragraph
				style={{
					marginTop: 30,
					marginLeft: "auto",
					marginRight: "auto",
					maxWidth: 400,
					textAlign: "center",
				}}
			>
				General Information
			</Paragraph>
			<Form {...formItemLayout}>
				<Form.Item
					name="module_name"
					hasFeedback
					validateStatus={nameValidStatus}
					help={nameHelpText}
					label="Module name"
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
					label="Module Description"
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
				>
					<TextArea onChange={(e) => setDesc(e.target.value)} />
				</Form.Item>
				{/* Tech Stack questioning */}
				<Paragraph
					style={{
						marginLeft: "auto",
						marginRight: "auto",
						maxWidth: 400,
						textAlign: "center",
					}}
				>
					Technology
				</Paragraph>
				{/* What Game */}
				<Form.Item
					name="game"
					label="Choose Game"
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					rules={[
						{
							required: true,
							message: "Please choose game",
						},
					]}
				>
					<Select
						showSearch
						style={{ width: 200 }}
						placeholder="Select a game"
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						onSelect={(e) => setGameWithName(e)}
					>
						{supportedGames.map((game) => (
							<Option key={game.id} disabled={game.disabled} value={game.name}>
								{game.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				{/* Server Type */}
				{selectedGame !== null ? (
					<Form.Item
						name="server_type"
						label="Server Type"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
								message: "Please choose server type",
							},
						]}
					>
						<Select
							style={{ width: 200 }}
							placeholder="Select a server type"
							onSelect={(e) => setServerTypeWithName(e)}
						>
							{selectedGame["server_types"].map((type) => (
								<Option key={type.id} value={type.name}>
									{type.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					<div />
				)}
				{/* Server Version */}
				{selectedGameServer !== null ? (
					<Form.Item
						name="server_version"
						label="Server Version"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
								message: "Please choose server version",
							},
						]}
					>
						<Select
							style={{ width: 200 }}
							placeholder="Select server version"
							onSelect={(e) => setServerVersionWithName(e)}
						>
							{selectedGameServer.versions.map((version) => (
								<Option key={version.id} value={version.version}>
									{version.version}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					<div />
				)}

				{selectedServerVersion !== null ? (
					<div>
						<Paragraph
							style={{
								marginLeft: "auto",
								marginRight: "auto",
								maxWidth: 400,
								textAlign: "center",
							}}
						>
							Specification
						</Paragraph>
						<Form.Item
							name="port"
							label="Port"
							style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
							rules={[
								{
									required: true,
									message: "Please input the port you wish to run the server on",
								},
							]}
						>
							<Input type="number" onChange={(e) => setPort(e.target.value)} />
						</Form.Item>
					</div>
				) : (
					<div />
				)}
			</Form>
			<Button.Group style={{ width: "100%" }}>
				{/* TODO Add more validation when its time */}
				<Button
					disabled={
						!validName ||
						selectedGameServer === null ||
						selectedGame === null ||
						selectedServerVersion === null ||
						port.length < 4
					}
					type="primary"
					style={{ marginLeft: "auto", marginRight: "auto" }}
					onClick={() => handleNext()}
				>
					Forward
					<RightOutlined />
				</Button>
			</Button.Group>
		</div>
	);
}

export default Setup;
