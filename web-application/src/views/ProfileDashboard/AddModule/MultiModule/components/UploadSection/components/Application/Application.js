import { Button, Card, Col, Row, Upload } from "antd";
import React from "react";
import { GithubOutlined, FileZipOutlined, InboxOutlined, CodeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

function UploadSection(props) {
	const [executableSelected, setExecutableSelected] = React.useState(false);
	const [fileList, setFileList] = React.useState([]);
	const [style, setStyle] = React.useState("upload-card");
	// Import sub components from antd
	const { Dragger } = Upload;
	// Get methods from props
	const { addModule, setActiveStep, prevStep } = props.methods;
	const { moduleSpec } = props.values;

	const toggleStyle = () => {
		if (style === "upload-card") {
			setStyle("upload-card-active");
		} else {
			setStyle("upload-card");
		}
	};

	const uploadProps = {
		name: "file",
		multiple: false,
		accept: ".jar",
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
		if (fileList.length > 0) {
			let module = {
				moduleSpec: moduleSpec,
				"module-file": fileList,
			};
			addModule(module);
			setActiveStep(0);
		}
	};

	return (
		<div>
			<Row className="upload-wrapper" type="flex" justify="center" gutter={[16]}>
				<Col span={5}>
					<Card className="upload-card">
						<Row type="flex" justify="center" align="middle">
							<div style={{ textAlign: "center" }}>
								<Col xs={24}>
									<GithubOutlined style={{ fontSize: 30 }} />
								</Col>
								<Col style={{ fontSize: 20 }} xs={24}>
									Github
								</Col>
							</div>
						</Row>
					</Card>
				</Col>
				<Col span={5}>
					<Card className="upload-card">
						<Row type="flex" justify="center" align="middle">
							<div style={{ textAlign: "center" }}>
								<Col xs={24}>
									<FileZipOutlined style={{ fontSize: 30 }} />
								</Col>
								<Col style={{ fontSize: 20 }} xs={24}>
									.ZIP
								</Col>
							</div>
						</Row>
					</Card>
				</Col>
				<Col span={5}>
					<Card
						className={style}
						onClick={() => {
							toggleStyle();
							setExecutableSelected(!executableSelected);
						}}
					>
						<Row type="flex" justify="center" align="middle">
							<div style={{ textAlign: "center" }}>
								<Col xs={24}>
									<CodeOutlined style={{ fontSize: 30 }} />
								</Col>
								<Col style={{ fontSize: 20 }} xs={24}>
									Executable
								</Col>
							</div>
						</Row>
					</Card>
				</Col>
				<Col xs={24}>
					<div style={{ maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
						{executableSelected ? (
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
						) : (
							<div />
						)}
					</div>
				</Col>
				<Button.Group style={{ width: "100%", textAlign: "center", marginTop: 60 }}>
					<Button type="primary" onClick={() => prevStep()}>
						<LeftOutlined />
						Backward
					</Button>
					<Button disabled={fileList.length <= 0} type="primary" onClick={() => moduleUpload()}>
						Upload
						<RightOutlined />
					</Button>
				</Button.Group>
			</Row>
		</div>
	);
}

export default UploadSection;
