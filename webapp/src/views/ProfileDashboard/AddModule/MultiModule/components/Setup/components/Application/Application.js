import React, { useEffect } from "react";
import { Button, Form, Input, Radio, Typography } from "antd";
// Import custom components
import LanguageSelector from "../../../../../SingleModule/components/Setup/components/LanguageSelector";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function Application(props) {
	// State (This needs to be returned to parent when clicking next)
	const [port, setPort] = React.useState("");
	// State passed as props to component
	const [supportedLanguages, setSupportedLanguages] = React.useState([]);
	const [selectedLanguage, setSelectedLanguage] = React.useState(null);
	const [selectedVersion, setSelectedVersion] = React.useState(null);
	// Selections
	const [frameworkTouched, setFrameworkTouched] = React.useState(false);

	// Get methods from props
	const { setModuleSpec, prevStep, nextStep } = props.methods;
	const { name, desc, selectedType } = props.values;

	// Import sub components from antd
	const { Paragraph } = Typography;

	const handleChange = (input, value) => {
		switch (input) {
			case 0:
				setSelectedLanguage(value);
				break;

			case 1:
				setSelectedVersion(value);
				break;

			default:
				break;
		}
	};

	useEffect(() => {
		// Create dummy list
		let dummyData = [
			{
				id: 1,
				name: "Java",
				versions: [
					{
						id: 1,
						version: 8,
					},
					{
						id: 2,
						version: 11,
					},
				],
			},
		];
		// Add dummy list to state on mount
		setSupportedLanguages(dummyData);
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

	const handleNext = () => {
		setModuleSpec({
			name: name,
			desc: desc,
			type: selectedType,
			port: port,
			language: selectedLanguage,
			version: selectedVersion,
		});
		nextStep();
	};

	return (
		<div>
			<Form {...formItemLayout}>
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
				<Form.Item
					label="Framework?"
					style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					rules={[
						{
							required: true,
							message: "Please answer",
						},
					]}
				>
					<Radio.Group>
						<Radio value="yes" onChange={() => setFrameworkTouched(false)}>
							Yes
						</Radio>
						<Radio value="no" onChange={() => setFrameworkTouched(true)}>
							no
						</Radio>
					</Radio.Group>
				</Form.Item>
				{/* Programming language */}
				{/* TODO Change this to fetch data from backend */}
				{frameworkTouched ? (
					<Form.Item
						label="Language"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
								message: "Please choose language and version",
							},
						]}
					>
						<LanguageSelector
							values={{ supportedLanguages, selectedLanguage, selectedVersion }}
							handleChange={handleChange}
						/>
					</Form.Item>
				) : (
					<div />
				)}
				{frameworkTouched ? (
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
							<Input type="number" onChange={(e) => setPort(e.target.value)} />
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
					disabled={name.length <= 0 || selectedLanguage === null || selectedVersion === null || port.length <= 3}
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

export default Application;
