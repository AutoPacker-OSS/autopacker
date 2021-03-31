import {
	Card,
	Col,
	Empty,
	PageHeader,
	Row,
	Tag,
	Typography,
	Avatar,
	Pagination,
	Divider,
} from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import Identicon from "../../assets/image/download.png";
import { GlobalOutlined, GitlabOutlined, FolderOutlined } from "@ant-design/icons";

function ProfileProjectOverview() {
	// State
	const [project, setProject] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	// Import sub components from antd
	const { Title, Paragraph, Text } = Typography;

	// Pagination state for modules
	const [minNumbModules, setMinNumbModules] = React.useState(0);
	const [maxNumbModules, setMaxNumbModules] = React.useState(10);

	useEffect(() => {
		const selectedUser = sessionStorage.getItem("selectedPublicUser");
		const selectedProject = sessionStorage.getItem("selectedPublicProject");

		const url =
			process.env.REACT_APP_APPLICATION_URL +
			process.env.REACT_APP_FILE_DELIVERY_API +
			"/project-overview/" +
			selectedUser +
			"/" +
			selectedProject;

		axios.get(url).then((response) => {
			setProject(response.data);
			setTags(response.data.tags.split(","));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleProjectsPaginationChange = (value) => {
		if (value <= 1) {
			setMinNumbModules(0);
			setMaxNumbModules(10);
		} else {
			setMinNumbModules((value - 1) * 10);
			setMaxNumbModules(value * 10);
		}
	};

	const title = (
		<div>
			{project.projectName}
			<GlobalOutlined style={{ marginLeft: 20 }} />
			{project.private ? " Private" : " Public"}
		</div>
	);

	return (
		<React.Fragment>
			<Row style={{
				borderTop: "1px solid rgb(235, 237, 240)",
				backgroundColor: "#FFFFFF",
			}}/>
			<Row style={{ marginTop: 20 }}>
				<Col span={14} offset={5}>
					<Row style={{ maxWidth: 1100 }} gutter={[24, 0]}>
						{/* Profile details */}
						<Col xs={24} md={7}>
							<div style={{ textAlign: "center" }}>
								<img
									style={{
										border: "1px solid black",
										padding: 5,
										backgroundColor: "white",
									}}
									className="identicon"
									src={Identicon}
									alt="identicon"
								/>
								<Title level={4}>{project.owner}</Title>
							</div>
						</Col>
						{/* Profile Content */}
						<Col xs={24} md={17}>
							<PageHeader
								style={{
									border: "1px solid rgb(235, 237, 240)",
									backgroundColor: "#FFFFFF",
									paddingBottom: 40,
								}}
								onBack={() => window.history.back()}
								title={title}
							>
								<Paragraph>{project.desc}</Paragraph>
								<Paragraph style={{ color: "blue" }}>
									{project.website !== "" ? (
										<a
											href={project.website}
											rel="noopener noreferrer"
											target="_blank"
										>
											<GitlabOutlined /> {project.website}
										</a>
									) : (
										<div />
									)}
								</Paragraph>
								<div>
									<div style={{ float: "left" }}>
										{tags.length > 1 ? (
											tags.map((tag) => (
												<span key={tag} style={{ display: "inline-block" }}>
													<Tag color="blue">{tag}</Tag>
												</span>
											))
										) : (
											<div />
										)}
									</div>
									{/* <Paragraph style={{ float: "right" }}>
												{format(project.lastUpdated, "dd/MM/yyyy")}
											</Paragraph> */}
								</div>
							</PageHeader>
							<Card style={{ marginTop: 20 }}>
								{project.modules != null ? (
									<Row style={{ marginTop: 10 }} gutter={[0, 24]}>
										{project.modules
											.slice(minNumbModules, maxNumbModules)
											.map((module) => (
												<Col style={{ padding: 0 }} xs={24} key={module.id}>
													<div key={module.id}>
														<Col style={{ padding: 0 }}>
															<Avatar
																shape="square"
																size={64}
																icon={<FolderOutlined />}
																style={{
																	backgroundColor: "#ff99f7",
																	float: "left",
																	verticalAlign: "middle",
																	marginBottom: 0,
																	marginRight: 12,
																	cursor: "pointer",
																}}
															/>

															<Text strong>{module.name}</Text>

															<Paragraph ellipsis>
																{module.desc}
															</Paragraph>
															<p>Type: {module.configType}</p>
														</Col>
														{project.modules.length > 1 ? (
															project.modules.indexOf(module) <
															project.modules.length - 1 ? (
																<Divider />
															) : (
																<div />
															)
														) : (
															<div />
														)}
													</div>
												</Col>
											))}
										{project.modules.length > 10 ? (
											<Pagination
												style={{
													marginBottom: 20,
													textAlign: "center",
												}}
												defaultCurrent={1}
												defaultPageSize={10}
												onChange={handleProjectsPaginationChange}
												total={project.modules.length}
											/>
										) : (
											<div />
										)}
									</Row>
								) : (
									<Empty />
								)}
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>
		</React.Fragment>
	);
}

export default ProfileProjectOverview;
