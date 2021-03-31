import { Steps } from "antd";
import React from "react";
import Building from "./components/Building/Building";
import Complete from "./components/Complete/Complete";
import Setup from "./components/Setup/Setup";
// Custom components
import UploadSection from "./components/Upload/UploadSection";

function AddModule() {
	// State
	const [activeStep, setActiveStep] = React.useState(0);

	// Single Module information
	const [setupInfo, setSetupInfo] = React.useState({});
	const [file, setFile] = React.useState([]);
	const [uploadSuccess, setUploadSuccess] = React.useState(false);

	// Get antd sub components
	const { Step } = Steps;

	const nextStep = () => {
		setActiveStep(activeStep + 1);
	};

	const prevStep = () => {
		setActiveStep(activeStep - 1);
	};

	const steps = [
		{
			title: "Setup",
			content: <Setup methods={{ setSetupInfo, prevStep, nextStep }} />,
		},
		{
			title: "Upload",
			content: <UploadSection methods={{ setFile, prevStep, nextStep }} />,
		},
		{
			title: "Building",
			// Methods will be removed when shit is complete
			content: <Building methods={{ setUploadSuccess, nextStep }} values={{ setupInfo, file }} />,
		},
		{
			title: "Complete",
			content: <Complete values={{ setupInfo, uploadSuccess }} />,
		},
	];

	return (
		<div style={{ width: "100%" }}>
			<Steps current={activeStep}>
				{steps.map((item) => (
					<Step key={item.title} title={item.title} />
				))}
			</Steps>
			<div className="steps-content">{steps[activeStep].content}</div>
		</div>
	);
}

export default AddModule;
