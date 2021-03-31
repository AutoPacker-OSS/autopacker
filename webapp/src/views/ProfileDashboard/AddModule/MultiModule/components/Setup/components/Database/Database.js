import { Button, Form, Input, Tooltip, Typography } from "antd";
import React, { useEffect } from "react";
// Custom components
import DatabaseSelector from "./DatabaseSelector";
import { QuestionCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

function Database(props) {
	// State
	const [supportedDatabases, setSupportedDatabases] = React.useState([]);
	// Credentials
	const [dbName, setDBName] = React.useState("");
	const [dbUsername, setDBUsername] = React.useState("");
	const [dbPassword, setDBPassword] = React.useState("");
	// Version and other specifications
	const [database, setDatabase] = React.useState(null);
	const [version, setVersion] = React.useState(null);
	const [port, setPort] = React.useState("");

	// Import sub components from antd
	const { Paragraph } = Typography;

	const { setModuleSpec, prevStep, nextStep } = props.methods;
	const { name, desc, selectedType } = props.values;

	useEffect(() => {
		// Create dummy list
		let dummyData = [
			{
				id: 1,
				name: "MySQL",
				versions: [
					{
						id: 1,
						version: "8",
					},
					{
						id: 2,
						version: "5.7",
					},
				],
			},
			{
				id: 2,
				name: "PostgreSQL",
				versions: [
					{
						id: 3,
						version: "12",
					},
					{
						id: 4,
						version: "11",
					},
					{
						id: 5,
						version: "10",
					},
				],
			},
		];
		// Add dummy list to state on mount
		setSupportedDatabases(dummyData);
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

	const handleChange = (input, value) => {
		switch (input) {
			case 1:
				setDBName(value);
				break;

			case 2:
				setDBUsername(value);
				break;

			case 3:
				setDBPassword(value);
				break;

			case 4:
				setDatabase(value);
				break;

			case 5:
				setVersion(value);
				break;

			case 6:
				setPort(value);
				break;

			default:
				break;
		}
	};

	const handleNext = () => {
		setModuleSpec({
			name: name,
			desc: desc,
			type: selectedType,
			dbName: dbName,
			dbUsername: dbUsername,
			dbPassword: dbPassword,
			port: port,
			database: database,
			version: version,
		});
		nextStep();
	};

	return (
		<div>
			<Form {...formItemLayout}>
				{/* Database name */}
				<Form.Item
					label={
						<span>
							DB Name&nbsp;
							<Tooltip title="The name for the database">
								<QuestionCircleOutlined />
							</Tooltip>
						</span>
					}
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					rules={[
						{
							required: true,
							message: "Please input the name of the database",
						},
					]}
				>
					<Input
						onChange={(e) => {
							handleChange(1, e.target.value);
						}}
					/>
				</Form.Item>
				{/* Database username */}
				<Form.Item
					label={
						<span>
							DB Username&nbsp;
							<Tooltip title="The username for the database">
								<QuestionCircleOutlined />
							</Tooltip>
						</span>
					}
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					rules={[
						{
							required: true,
							message: "Please input the username for the database",
						},
					]}
				>
					<Input
						onChange={(e) => {
							handleChange(2, e.target.value);
						}}
					/>
				</Form.Item>
				{/* Database password */}
				<Form.Item
					label={
						<span>
							DB Password&nbsp;
							<Tooltip title="The password for the database. Can be empty.">
								<QuestionCircleOutlined />
							</Tooltip>
						</span>
					}
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
				>
					<Input
						type="password"
						onChange={(e) => {
							handleChange(3, e.target.value);
						}}
					/>
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
				{/* Programming language */}
				{/* TODO Change this to fetch data from backend */}
				<Form.Item
					label="Database"
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					rules={[
						{
							required: true,
							message: "Please choose your database and version",
						},
					]}
				>
					<DatabaseSelector values={{ supportedDatabases, database, version }} methods={{ handleChange }} />
				</Form.Item>
				{version !== null ? (
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
							label="Port"
							style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
							rules={[
								{
									required: true,
									message: "Please input the port you wish to run the service on",
								},
							]}
						>
							<Input
								type="number"
								onChange={(e) => {
									handleChange(6, e.target.value);
								}}
							/>
						</Form.Item>
					</div>
				) : (
					<div />
				)}
			</Form>
			<Button.Group style={{ width: "100%", textAlign: "center" }}>
				<Button type="primary" onClick={() => prevStep()}>
					<LeftOutlined />
					Backward
				</Button>
				<Button
					disabled={
						name.length <= 0 ||
						dbName.length <= 0 ||
						dbUsername.length <= 0 ||
						port.length <= 3 ||
						database === null ||
						version === null
					}
					type="primary"
					onClick={() => handleNext()}
				>
					Forward
					<RightOutlined />
				</Button>
			</Button.Group>
		</div>
	);
}

export default Database;
