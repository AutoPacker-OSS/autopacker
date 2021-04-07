import { Card, Col, Input, Layout, PageHeader, Row, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {Redirect, useParams} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import Moment from 'moment';
// Import custom hooks
import useDebounce from "./../../../hooks/useDebounce";
import {format} from "date-fns";
// Import helper methods

function OrganizationDashboard() {
	// State
	const [search, setSearch] = React.useState("");
	const [organization, setOrganization] = React.useState({});
	const [projects, setProjects] = React.useState([]);
	const [selectedCard, setSelectedCard] = React.useState(null);
	// TODO Implement this functionality for organization selected project view thingy


	const debouncedSearchTerm = useDebounce(search, 500);

	const [keycloak] = useKeycloak();

	const { organizationName } = useParams();

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Search } = Input;
	const { Meta } = Card;

	useEffect(() => {
		setSelectedCard(null);

		axios({
			method: "get",
			url: process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + "/organization/" + organizationName,
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setOrganization(response.data);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Inspired from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
	useEffect(
		() => {
			// Make sure we have a value (user has entered something in input)
			if (debouncedSearchTerm) {
				// Fire off our API call
				axios({
					method: "get",
					url:
						process.env.REACT_APP_APPLICATION_URL +
						process.env.REACT_APP_API +
						"/organization/" +
						organizationName +
						"/projects/search?q=" +
						search,
					headers: {
						Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
					},
				}).then(function (response) {
					setProjects(response.data);
				});
			} else {
				axios({
					method: "get",
					url:
						process.env.REACT_APP_APPLICATION_URL +
						process.env.REACT_APP_API +
						"/organization/" +
						organizationName +
						"/projects",
					headers: {
						Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
					},
				}).then(function (response) {
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

	const routes = [
		{
			path: "organization/",
			breadcrumbName: "Dashboard",
		},
		{
			path: "organization/dashboard",
			breadcrumbName: "Organization Projects",
		},

	];

	return (
		<div style={{ width: "100%" }}>
			{organizationName == null ? <Redirect to="/profile/organizations" /> : <div />}
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title={organizationName + " Projects"}
				breadcrumb={{ routes }}
			>
				<Paragraph>{organization.description}</Paragraph>
			</PageHeader>
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
					minHeight: 280,
				}}
			>
				<Search
					style={{ /*width: "80%", marginRight: "3%"*/ width: "100%" }}
					placeholder="Search server.."
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Row style={{ marginTop: 20 }} gutter={[24, 24]}>
					{projects.map((project) => (
						<Col xs={24} lg={8} xl={6} key={project.id}>
							{/* Redirects user when a project card has been selected */}
							 {selectedCard !== null ? (
								<Redirect to={"/organization/" + organizationName + "/overview/" + selectedCard} />
							) : (
								<div />
							)}
							<Card
								className="org-project-card"
								hoverable
								style={{ width: 240, height: 330 }}
								onClick={() => {
									sessionStorage.setItem("selectedProjectName", project.name);
									sessionStorage.setItem("selectedProjectId", project.id);
									setSelectedCard(project.id);
								}}

								cover={
									<img
										alt="project"
										src={
											"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
										}
									/>
								}
							>
								<Meta
									title={project.name}
									description={
										<Paragraph ellipsis={{ rows: 3 }}>{project.description}</Paragraph>
									}
								/>
								<div
									style={{
										left: 0,
										bottom: 0,
										width: "100%",
										position: "absolute",
									}}
								>
									<Paragraph
										style={{
											color: "#878787",
											marginTop: 20,
											marginLeft: "auto",
											marginRight: "auto",
											width: "100%",
											textAlign: "center",
										}}
									>
										Last updated {Moment(project.lastUpdated).format('DD/MM/yyyy')}
									</Paragraph>
									<div
										style={{
											marginTop: -10,
											marginRight: "auto",
											marginBottom: 10,
											marginLeft: "auto",
											textAlign: "center",
										}}
									>
										{project.tags !== '' && project.tags !== null ? (
											<Paragraph ellipsis={{ rows: 1 }}>
												{project.tags.split(",", 3).map((tag) => (
													<span key={tag} style={{ display: "inline-block" }}>
														<Tag color="blue">{tag}</Tag>
													</span>
												))}
											</Paragraph>
										) : (
											<div />
										)}
									</div>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</Content>
		</div>
	);
}

export default OrganizationDashboard;
