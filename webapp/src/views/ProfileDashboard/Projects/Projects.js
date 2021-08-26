import { Button, Card, Col, Input, Layout, PageHeader, Row, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
// Import custom hooks
import useDebounce from "./../../../hooks/useDebounce";
// Import helper methods

import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import { GlobalOutlined } from "@ant-design/icons";

function Projects() {
	// State
	const [search, setSearch] = React.useState("");
	const [projects, setProjects] = React.useState([]);
	const [selectedCard, setSelectedCard] = React.useState(null);

	const debouncedSearchTerm = useDebounce(search, 500);

	const { authState } = useOktaAuth();

	const dispatch = useDispatch();

	//Button width/height size initial state
	const [btnWidth, setBtnWidth] = React.useState(0);
	const [btnHeight, setBtnHeight] = React.useState(0);
	const ref = React.useRef(null);

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Search } = Input;
	const { Meta } = Card;

	useEffect(() => {
			if (ref.current && ref.current.getBoundingClientRect().width) {
				setBtnWidth(ref.current.getBoundingClientRect().width);
			}
			if (ref.current && ref.current.getBoundingClientRect().height) {
				setBtnHeight(ref.current.getBoundingClientRect().height);
			}
		});

	useEffect(() => {
		setSelectedCard(null);
	}, []);

	// Inspired from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
	useEffect(
		() => {
			// Make sure we have a value (user has entered something in input)
			// TODO UNCOMMENT THIS AND FIX THIS SHIT
			// if (debouncedSearchTerm) {
			// 	// Fire off our API call
			// 	axios({
			// 		method: "get",
			// 		url:
			// 			process.env.REACT_APP_APPLICATION_URL +
			// 			process.env.REACT_APP_API +
			// 			"/projects/" +
			// 			keycloak.idTokenParsed.preferred_username +
			// 			"/search?q=" +
			// 			search,
			// 		headers: {
			// 			Authorization:
			// 				authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
			// 		},
			// 	}).then(function (response) {
			// 		setProjects(response.data);
			// 	});
			// } else {
			// 	axios({
			// 		method: "get",
			// 		url:
			// 			process.env.REACT_APP_APPLICATION_URL +
			// 			process.env.REACT_APP_API +
			// 			"/projects",
			// 		headers: {
			// 			Authorization:
			// 				authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
			// 		},
			// 	}).then(function (response) {
			// 		setProjects(response.data);
			// 		console.log(response.data)
			// 	});
			// }
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
			path: "/profile",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/profile/projects",
			breadcrumbName: "Your Projects",
		},
	];

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Your Projects"
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
			>
				<Paragraph>List of all your projects</Paragraph>
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
				<div style={{ display: "flex" }}>
					<Search
						style={{ width: "90%", marginRight: "5%" }}
					placeholder="Search projects..."
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button style={btnWidth && btnHeight
					? {
						width: `${btnWidth}px`,
						height: `${btnHeight}px`,
						marginLeft: "auto",
					}
					: {}} type="primary">
					<Link id="new-project-link" to="/profile/projects/new">
						New Project
					</Link>
				</Button>
				</div>
				<Row style={{ marginTop: 20 }} gutter={[24, 24]}>
					{projects.map((project) => (
						<Col xs={24} lg={8} xl={6} xxl={4} key={project.id}>
							{selectedCard !== null ? (
								<Redirect to={"/profile/projects/overview/" + selectedCard} />
							) : (
								<div />
							)}

							<Card
								className="project-card"
								hoverable
								style={{ width: 240, height: 350 }}
								onClick={() => {
									sessionStorage.setItem(
										"selectedProjectName",
										project.name
									);
									sessionStorage.setItem("selectedProjectId", project.id);
									setSelectedCard(project.name);
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
										Last updated {format(project.lastUpdated, "dd/MM/yyyy")}
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
										{ (project.tags && project.tags.length) > 0 ? (
											project.tags.split(",", 3).map((tag) => (
												<span key={tag} style={{ display: "inline-block" }}>
													<Tag color="blue">{tag}</Tag>
												</span>
											))
										) : (
											<div />
										)}
									</div>
									<Paragraph
										style={{
											color: "878787",
											textAlign: "right",
											paddingRight: 20,
											marginTop: -10,
										}}
									>
										<GlobalOutlined />
										{project.private ? " private" : " public"}
									</Paragraph>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</Content>
		</div>
	);
}

export default Projects;
