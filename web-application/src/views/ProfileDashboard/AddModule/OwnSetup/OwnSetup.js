import React from "react";
import { Typography, Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";

function OwnSetup() {
	// State
	const [fileList, setFileList] = React.useState([]);

	// import sub components from antd
	const { Paragraph, Title } = Typography;
	const { Dragger } = Upload;

	const uploadProps = {
		name: "file",
		multiple: false,
		accept: ".yml,.yaml",
		method: "post",
		withCredentials: true,
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			setFileList([file]);
			return false;
		},
	};

	return (
		<div style={{ width: "100%" }}>
			<Title style={{ textAlign: "center" }}>Complete Setup</Title>
			<Paragraph style={{ maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
				If you already have a docker-compose.yml file that describes your project architecture, you can simply upload that
				file as a "module" (assuming the docker image(s) in the file are available on docker hub). Then you can click
				upload on any of the servers you have and it will build the system out of your specification.{" "}
				<i>This is recommended for a realistic environment server test</i>
				<br />
				<br />
				<b>NB: The file needs to be docker-compose.yml or docker-compose.yaml, otherwise it won't work properly.</b>
			</Paragraph>
			<div style={{ maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
				<Dragger
					{...uploadProps}
					style={{
						margin: "20px auto 0 auto",
						maxWidth: 300,
					}}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
				</Dragger>
			</div>
			<div style={{ textAlign: "center", marginTop: 20 }}>
				<Button disabled={fileList.length <= 0} type="primary" onClick={() => console.warn("NOT YET IMPLEMENTED")}>
					Submit
				</Button>
			</div>
		</div>
	);
}

export default OwnSetup;
