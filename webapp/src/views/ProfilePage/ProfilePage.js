import { Avatar, Col, Divider, Input, Pagination, Row, Tabs, Tag, Typography } from "antd";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Identicon from "../../assets/image/download.png";
// Import custom hooks
import useDebounce from "./../../hooks/useDebounce";

function ProfilePage() {
	// State
	const [projects, setProjects] = React.useState([]);
	const [search, setSearch] = React.useState("");
	const [username, setUsername] = React.useState("");

	// Pagination state for projects
	const [minNumbProjects, setMinNumbProjects] = React.useState(0);
	const [maxNumbProjects, setMaxNumbProjects] = React.useState(10);

	// Import sub components from antd
	const { Title, Text, Paragraph } = Typography;
	const { TabPane } = Tabs;
	const { Search } = Input;

	const debouncedSearchTerm = useDebounce(search, 500);

	useEffect(() => {
		setUsername(sessionStorage.getItem("selectedPublicUser"));
	}, []);

	const handleProjectsPaginationChange = (value) => {
		if (value <= 1) {
			setMinNumbProjects(0);
			setMaxNumbProjects(10);
		} else {
			setMinNumbProjects((value - 1) * 10);
			setMaxNumbProjects(value * 10);
		}
	};

	// Inspired from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
	useEffect(
		() => {
			// Make sure we have a value (user has entered something in input)
			if (debouncedSearchTerm) {
				const projectsUrl =
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_FILE_DELIVERY_API +
					"/projects/" +
					username +
					"/public/search?q=" +
					search;

				axios.get(projectsUrl).then((response) => {
					setProjects(response.data);
				});
			} else {
				const projectsUrl =
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_FILE_DELIVERY_API +
					"/projects/" +
					window.location.href.split("/account/")[1] +
					"/public";

				axios.get(projectsUrl).then((response) => {
					setProjects(response.data);
				});
			}
		},
		// This is the useEffect input array
		// Our useEffect function will only execute if this value changes ...
		// ... and thanks to our hook it will only change if the original ...
		// value (searchTerm) hasn't changed for more than 500ms.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[debouncedSearchTerm]
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
								<Title level={4}>{username}</Title>
							</div>
						</Col>
						{/* Profile Content */}
						<Col xs={24} md={17}>
							<Tabs defaultActiveKey="1">
								<TabPane tab="Projects" key="1">
									<Search placeholder="input search text" onChange={(e) => setSearch(e.target.value)} />
									<Divider />
									{projects.length <= 0 ? (
										<p>No projects available</p>
									) : (
										<Row style={{ marginTop: 10 }} gutter={[0, 24]}>
											{projects.slice(minNumbProjects, maxNumbProjects).map((project) => (
												<Col style={{ padding: 0 }} xs={24} key={project.id}>
													<div key={project.id}>
														<Col style={{ padding: 0 }}>
															{/* TODO - all the styling should be moved to CSS, otherwise the logical structure becomes unreadable */}
															<Avatar
																shape="square"
																size={64}
																style={{
																	backgroundColor: "#ff99f7",
																	float: "left",
																	verticalAlign: "middle",
																	marginBottom: 24,
																	marginRight: 12,
																	cursor: "pointer",
																}}
															>
																{project.name.charAt(0).toUpperCase()}
															</Avatar>
															<div>
																<Link
																	onClick={() =>
																		sessionStorage.setItem(
																			"selectedPublicProject",
																			project.id
																		)
																	}
																	to={
																		"/account/" + username + "/project/" + project.name
																	}
																>
																	<Text
																		strong
																		style={{
																			cursor: "pointer",
																		}}
																	>
																		{project.name}
																	</Text>
																</Link>
																<Paragraph ellipsis>{project.description}</Paragraph>
																<div>
																	<div
																		style={{
																			float: "left",
																		}}
																	>
																		{project.tags.length > 1 ? (
																			project.tags.split(",", 2).map((tag) => (
																				<span
																					key={tag}
																					style={{
																						display: "inline-block",
																					}}
																				>
																					<Tag color="blue">{tag}</Tag>
																				</span>
																			))
																		) : (
																			<div />
																		)}
																	</div>
																	<Paragraph
																		style={{
																			float: "right",
																		}}
																	>
																		Last updated: {format(project.lastUpdated, "dd/MM/yyyy")}
																	</Paragraph>
																</div>
															</div>
														</Col>
														<Divider />
													</div>
												</Col>
											))}
											{projects.length > 10 ? (
												<Pagination
													style={{
														marginBottom: 20,
														textAlign: "center",
													}}
													defaultCurrent={1}
													defaultPageSize={10}
													onChange={handleProjectsPaginationChange}
													total={projects.length}
												/>
											) : (
												<div />
											)}
										</Row>
									)}
								</TabPane>
								<TabPane tab="Servers" key="2" disabled>
									No servers available
								</TabPane>
							</Tabs>
						</Col>
					</Row>
				</Col>
			</Row>
		</React.Fragment>
	);
}

export default ProfilePage;
