import { Card, Col, Layout, Menu, PageHeader, Row } from "antd";
import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import GeneralSetting from "./components/General/GeneralSetting";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";

function ProjectSettings() {
	// State
	const [activeOption, setActiveOption] = React.useState(1);
	const [project, setProject] = React.useState({});

	const { Content } = Layout;

	const [keycloak] = useKeycloak();

	useEffect(() => {
		let projectId = sessionStorage.getItem("selectedProjectId");

		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_FILE_DELIVERY_API +
				"/project-overview/" +
				projectId,
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setProject(response.data);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const routes = [
		{
			path: "/profile",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/projects",
			breadcrumbName: "Your Projects",
		},
		{
			path: "/overview/" + project.id,
			breadcrumbName: project.name,
		},
		{
			path: "/settings",
			breadcrumbName: "Settings",
		},
	];

	const getActiveMenuOption = () => {
		switch (activeOption) {
			case 1:
				return <GeneralSetting project={project} />;

			default:
				setActiveOption(1);
				return <GeneralSetting project={project} />;
		}
	};

	return (
		<React.Fragment>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title={project.name + " Settings"}
				onBack={() => window.history.back()}
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
			></PageHeader>
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
				}}
			>
				<Row gutter={[24, 0]}>
					{/* Settings menu */}
					<Col xs={24} md={7}>
						<Card bodyStyle={{ padding: 0 }} title="Project Settings">
							<Menu style={{ padding: 0 }} mode="inline" defaultSelectedKeys={["1"]}>
								<Menu.Item
									key="1"
									style={{
										margin: 0,
										borderBottom: "1px solid lightgrey",
										borderTop: "1px solid lightgrey",
									}}
									onClick={() => setActiveOption(1)}
								>
									General
								</Menu.Item>
							</Menu>
						</Card>
					</Col>
					{/* Settings Content */}
					<Col xs={24} md={17}>
						{getActiveMenuOption()}
					</Col>
				</Row>
			</Content>
		</React.Fragment>
	);
}

export default ProjectSettings;
