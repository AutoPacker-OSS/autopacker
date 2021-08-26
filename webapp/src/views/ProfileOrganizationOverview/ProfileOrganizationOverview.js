import {
	Avatar,
	Button,
	Col,
	Divider,
	Input,
	PageHeader,
	Pagination,
	Row,
	Tabs,
	Tag,
	Typography,
} from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import NTNU from "../../assets/image/ntnu.png";
import {useOktaAuth} from "@okta/okta-react";
// Import custom hooks
import useDebounce from "./../../hooks/useDebounce";

function ProfileOrganizationOverview() {
	// State
	const [projects, setProjects] = React.useState([]);
	const [search, setSearch] = React.useState("");
	const [organization, setOrganization] = React.useState({});
	const [isMember, setIsMember] = React.useState(true);

	// Pagination state for projects
	const [minNumbProjects, setMinNumbProjects] = React.useState(0);
	const [maxNumbProjects, setMaxNumbProjects] = React.useState(10);

	const { authState } = useOktaAuth();

	// Import sub components from antd
	const { Title, Text, Paragraph } = Typography;
	const { TabPane } = Tabs;
	const { Search } = Input;

	const debouncedSearchTerm = useDebounce(search, 500);

	const { organizationName } = useParams();

	useEffect(() => {
		// TODO UNCOMMENT THIS AND FIX THIS SHIT
		// if (organizationName) {
		// 	clearSessionStorage()
		// 	const projectsUrl =
		// 		process.env.REACT_APP_APPLICATION_URL +
		// 		process.env.REACT_APP_API +
		// 		"/organization/" +
		// 		organizationName;
		//
		// 	axios.get(projectsUrl).then((response) => {
		// 		setOrganization(response.data);
		// 	});
		//
		// 	if (keycloak.authenticated) {
		// 		// First checking if the value isMemberOfOrganization is available in session, if not do a request.
		// 		axios
		// 			.get(
		// 				process.env.REACT_APP_APPLICATION_URL +
		// 				process.env.REACT_APP_API +
		// 				"/organization/" +
		// 				organizationName +
		// 				"/" +
		// 				keycloak.idTokenParsed.preferred_username +
		// 				"/isMember"
		// 			)
		// 			.then((response) => {
		// 				sessionStorage.setItem("isMember", response.data);
		// 				setIsMember(response.data);
		// 			})
		// 			.catch(() => {
		// 				// Set default to true to hide the request membership button
		// 				setIsMember(true);
		// 			});
		// 	}
		// }

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [organizationName]);

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
					process.env.REACT_APP_API +
					"/organization/" +
					organization.name +
					"/projects/search?q=" +
					search;

				axios.get(projectsUrl).then((response) => {
					setProjects(response.data);
				});
			} else {
				const organizationName = sessionStorage.getItem("selectedPublicOrganization");

				const projectsUrl =
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_API +
					"/organization/" +
					organizationName +
					"/projects";

				axios.get(projectsUrl).then((response) => {
					console.log("RESPONSE DATA:", response.data);
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

	const clearSessionStorage = () => {
		sessionStorage.removeItem("isMember")
	}

	return (
		<React.Fragment>
			<Row style={{
				borderTop: "1px solid rgb(235, 237, 240)",
				backgroundColor: "#FFFFFF",
			}}/>
			<Row style={{ marginTop: 20
			}}>
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
									src={NTNU}
									alt="NTNU logo"
								/>
								<Title level={4}>{organization.name}</Title>
							</div>
						</Col>
						{/* Profile Content */}
						<Col xs={24} md={17}>
							<PageHeader
								style={{
									border: "1px solid rgb(235, 237, 240)",
									backgroundColor: "#FFFFFF",
								}}
								title={organization.name}
								onBack={() => window.history.back()}
								// TODO UNCOMMENT THIS AND FIX THIS SHIT
								// extra={[
								// 	keycloak.authenticated ? (
								// 		keycloak.idTokenParsed.email_verified && !isMember ? (
								// 			<Button key="application" onClick={() => clearSessionStorage()}>
								// 				<Link
								// 					to={
								// 						"/organization/" +
								// 						organization.name +
								// 						"/membership"
								// 					}
								// 				>
								// 					Request Membership
								// 				</Link>
								// 			</Button>
								// 		) : (
								// 			<div />
								// 		)
								// 	) : (
								// 		<div />
								// 	),
								// ]}
							>
								<Paragraph ellipsis={{ rows: 3, expandable: true }}>
									{organization.description}
								</Paragraph>
							</PageHeader>
							<Tabs defaultActiveKey="1">
								<TabPane tab="Projects" key="1">
									<Search
										placeholder="input search text"
										onChange={(e) => setSearch(e.target.value)}
									/>
									<Divider />
									{projects.length <= 0 ? (
										<p>No projects available</p>
									) : (
										<Row style={{ marginTop: 10 }} gutter={[0, 24]}>
											{projects
												.slice(minNumbProjects, maxNumbProjects)
												.map((project) => (
													<Col
														style={{ padding: 0 }}
														xs={24}
														key={project.id}
													>
														<div key={project.id}>
															<Col style={{ padding: 0 }}>
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
																	{project.name
																		.charAt(0)
																		.toUpperCase()}{" "}
																</Avatar>
																<div>
																	<Link to={"#"}>
																		<Text
																			strong
																			style={{
																				cursor: "pointer",
																			}}
																		>
																			{project.name} /{" "}
																			{project.tags !== '' && project.tags !== null? (
																				project.tags
																					.split(",", 2)
																					.map((tag) => (
																						<span
																							key={
																								tag
																							}
																							style={{
																								display:
																									"inline-block",
																							}}
																						>
																							<Tag color="blue">
																								{
																									tag
																								}
																							</Tag>
																						</span>
																					))
																			) : (
																				<div />
																			)}
																		</Text>
																	</Link>
																	<Paragraph ellipsis>
																		{project.description}
																	</Paragraph>
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
							</Tabs>
						</Col>
					</Row>
				</Col>
			</Row>
		</React.Fragment>
	);
}

export default ProfileOrganizationOverview;
