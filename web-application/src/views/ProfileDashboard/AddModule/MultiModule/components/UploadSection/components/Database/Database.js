import { Button, Typography, Upload } from "antd";
import React from "react";
import { InboxOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

function Database(props) {
	// State
	const [fileList, setFileList] = React.useState([]);
	// Import sub components from antd
	const { Dragger } = Upload;
	const { Paragraph } = Typography;
	// Get methods from props
	const { addModule, setActiveStep, prevStep } = props.methods;
	const { moduleSpec } = props.values;

	const uploadProps = {
		name: "file",
		multiple: false,
		accept: ".sql",
		method: "post",
		withCredentials: true,
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			//console.log(fileList);
			//console.log(file);
			setFileList([file]);
			return false;
		},
	};

	const moduleUpload = () => {
		let module = {
			moduleSpec: moduleSpec,
			"module-file": fileList,
		};
		addModule(module);
		setActiveStep(0);
	};

	return (
		<div>
			{/* Header */}
			<Paragraph style={{ maxWidth: 500, marginLeft: "auto", marginRight: "auto", marginTop: 20 }}>
				If you have a sql script that need to be executed to provision the database with the tables and data needed, add
				this sql script here. If you don't need it (for example your application provisions with the needed data), just
				click "Upload"
			</Paragraph>
			{/* Upload dropzone */}
			<div style={{ maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
				<Dragger
					{...uploadProps}
					style={{
						marginTop: 30,
						maxWidth: 300,
						marginLeft: "auto",
						marginRight: "auto",
					}}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
				</Dragger>
			</div>
			{/* Button Group */}
			<Button.Group style={{ width: "100%", textAlign: "center", marginTop: 60 }}>
				<Button type="primary" onClick={() => prevStep()}>
					<LeftOutlined />
					Backward
				</Button>
				<Button type="primary" onClick={() => moduleUpload()}>
					Upload
					<RightOutlined />
				</Button>
			</Button.Group>
		</div>
	);
}

export default Database;
