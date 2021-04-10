import { Avatar, Col, Divider, Input, Pagination, Row, Tabs, Typography } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { ApartmentOutlined, UserOutlined } from "@ant-design/icons";

function SearchResult(props) {
	// State
	const [search, setSearch] = React.useState("");
	const [projectsList, setProjectsList] = React.useState([]);
	const [usersList, setUsersList] = React.useState([]);
	const [organizationsList, setOrganizationsList] = React.useState([]);
	const [searchAction, setSearchAction] = React.useState(false);

	// Pagination state for projects
	const [minNumbProjects, setMinNumbProjects] = React.useState(0);
	const [maxNumbProjects, setMaxNumbProjects] = React.useState(10);

	// Pagination state for users
	const [minNumbUsers, setMinNumbUsers] = React.useState(0);
	const [maxNumbUsers, setMaxNumbUsers] = React.useState(10);

	// Pagination state for organizations
	const [minNumbOrganizations, setMinNumbOrganizations] = React.useState(0);
	const [maxNumbOrganizations, setMaxNumbOrganizations] = React.useState(10);

	// Import sub components from antd
	const { Title, Paragraph, Text } = Typography;
	const { Search } = Input;
	const { TabPane } = Tabs;

	// Initialized on mount (TODO Find a better way to do this :P)
	useEffect(() => {
		setSearchAction(false);

		let arr = window.location.href.split("=", 2);
		let query = arr[1];
		setSearch(query);

		/* Fetch projects */

		const projectsUrl =
			process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + "/projects/search?q=" + query;

		axios.get(projectsUrl).then((response) => {
			setProjectsList(response.data);
		});

		/* Fetch Users */

		const usersUrl =
			process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + "/auth/search?q=" + query;

		axios.get(usersUrl).then((response) => {
			setUsersList(response.data);
		});

		/* Fetch Organizations */

		const organizationUrl =
			process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + "/organization/search?q=" + query;

		axios.get(organizationUrl).then((response) => {
			setOrganizationsList(response.data);
		});
	}, [searchAction, window.location.href]);

	const handleProjectsPaginationChange = (value) => {
		if (value <= 1) {
			setMinNumbProjects(0);
			setMaxNumbProjects(10);
		} else {
			setMinNumbProjects((value - 1) * 10);
			setMaxNumbProjects(value * 10);
		}
	};

	const handleUsersPaginationChange = (value) => {
		if (value <= 1) {
			setMinNumbUsers(0);
			setMaxNumbUsers(10);
		} else {
			setMinNumbUsers((value - 1) * 10);
			setMaxNumbUsers(value * 10);
		}
	};

	const handleOrganizationsPaginationChange = (value) => {
		if (value <= 1) {
			setMinNumbOrganizations(0);
			setMaxNumbOrganizations(10);
		} else {
			setMinNumbOrganizations((value - 1) * 10);
			setMaxNumbOrganizations(value * 10);
		}
	};

	return (
		<React.Fragment>
			<Row
				style={{
					borderTop: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
			>
				<Col span={14} offset={5}>
					<Title style={{ marginTop: 20 }} level={2}>
						Search
					</Title>
					<Divider />
					<Row>
						<Col xs={24}>
							<Search
								value={search}
								placeholder="Search..."
								onChange={(e) => setSearch(e.target.value)}
								onSearch={() => setSearchAction(true)}
								enterButton
							/>
						</Col>
						{searchAction ? <Redirect to={"/search?q=" + search} /> : <div />}
						<Col xs={24}>
							<Tabs defaultActiveKey={"1"}>
								{/* Projects Tab */}
								<TabPane tab={"Projects (" + projectsList.length + ")"} key="1">
									{projectsList.length <= 0 ? (
										<p>No projects found</p>
									) : (
										<Row gutter={[0, 12]}>
											<Divider />

											{projectsList.slice(minNumbProjects, maxNumbProjects).map((project) => (
												<Col key={project.id} span={24}>
													<Avatar
														shape="square"
														size={56}
														style={{
															backgroundColor: "#ff99f7",
															float: "left",
															verticalAlign: "middle",
															marginBottom: 24,
															marginTop: -10,
															marginRight: 12,
															cursor: "pointer",
														}}
													>
														{project.name.charAt(0).toUpperCase()}
													</Avatar>

													<Link
														onClick={() => {
															sessionStorage.setItem("selectedPublicUser", project.owner.username);
															sessionStorage.setItem("selectedPublicProject", project.id);
														}}
														to={"/account/" + project.owner.username + "/project/" + project.name}
													>
														<Text
															strong
															style={{
																cursor: "pointer",
															}}
														>
															{project.owner.username} / {project.name}
														</Text>
													</Link>
													<Paragraph ellipsis>{project.description}</Paragraph>
													<Divider />
												</Col>
											))}
											{projectsList.length > 10 ? (
												<Pagination
													style={{
														marginBottom: 20,
														textAlign: "center",
													}}
													defaultCurrent={1}
													defaultPageSize={10}
													onChange={handleProjectsPaginationChange}
													total={projectsList.length}
												/>
											) : (
												<div />
											)}
										</Row>
									)}
								</TabPane>
								{/* Users Tab */}
								<TabPane tab={"Users (" + usersList.length + ")"} key="2">
									{usersList.length <= 0 ? (
										<p>No users found</p>
									) : (
										<Row gutter={[0, 12]}>
											<Divider />
											{usersList.slice(minNumbUsers, maxNumbUsers).map((user) => (
												<Col key={user.id} span={24}>
													<Avatar
														shape="square"
														size={56}
														icon={<UserOutlined />}
														style={{
															backgroundColor: "#ff99f7",
															float: "left",
															verticalAlign: "middle",
															marginBottom: 24,
															marginTop: -10,
															marginRight: 12,
															cursor: "pointer",
														}}
													/>

													<Link
														onClick={() =>
															sessionStorage.setItem("selectedPublicUser", user.username)
														}
														to={"/account/" + user.username}
													>
														<Text
															strong
															style={{
																cursor: "pointer",
																verticalAlign: "middle",
															}}
														>
															{user.username}
														</Text>
													</Link>
													<Divider />
												</Col>
											))}
											{usersList.length > 10 ? (
												<Pagination
													style={{
														marginBottom: 20,
														textAlign: "center",
													}}
													defaultCurrent={1}
													defaultPageSize={10}
													onChange={handleUsersPaginationChange}
													total={usersList.length}
												/>
											) : (
												<div />
											)}
										</Row>
									)}
								</TabPane>
								{/* Organization Tab */}
								<TabPane tab={"Organizations (" + organizationsList.length + ")"} key="3">
									{organizationsList.length <= 0 ? (
										<p>No organizations found</p>
									) : (
										<Row gutter={[0, 12]}>
											<Divider />
											{organizationsList
												.slice(minNumbOrganizations, maxNumbOrganizations)
												.map((organization) => (
													<Col key={organization.id} span={24}>
														<Avatar
															shape="square"
															size={56}
															icon={<ApartmentOutlined />}
															style={{
																backgroundColor: "#ff99f7",
																float: "left",
																verticalAlign: "middle",
																marginBottom: 24,
																marginTop: -10,
																marginRight: 12,
																cursor: "pointer",
															}}
														/>
														<div>
															<Link
																onClick={() =>
																	sessionStorage.setItem(
																		"selectedPublicOrganization",
																		organization.name
																	)
																}
																to={"/organization/" + organization.name}
															>
																<Text
																	strong
																	style={{
																		cursor: "pointer",
																		verticalAlign: "middle",
																	}}
																>
																	{organization.name}
																</Text>
															</Link>
															<Paragraph ellipsis>{organization.description}</Paragraph>
														</div>
														<Divider />
													</Col>
												))}
											{organizationsList.length > 10 ? (
												<Pagination
													style={{
														marginBottom: 20,
														textAlign: "center",
													}}
													defaultCurrent={1}
													defaultPageSize={10}
													onChange={handleOrganizationsPaginationChange}
													total={organizationsList.length}
												/>
											) : (
												<div />
											)}
										</Row>
									)}
								</TabPane>
							</Tabs>
						</Col>
					</Row>
				</Col>
			</Row>
		</React.Fragment>
	);
}

export default SearchResult;
