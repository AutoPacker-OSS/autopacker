import { Card, Col, Row, PageHeader, Typography, Layout } from "antd";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// Import styles
import "./ModuleStyle.scss";
import AddModule from "./SingleModule/AddModule";
import OwnSetup from "./OwnSetup/OwnSetup";
import MultiModule from "./MultiModule/MultiModule";
import {
	FileAddOutlined,
	BuildOutlined,
	UserOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
import GameModule from "./GameModule/GameModule";

function ModuleSelection() {
	// State
	const [selectedChoice, setSelectedChoice] = React.useState(null);

	// Import sub components from antd
	const { Paragraph } = Typography;
	const { Content } = Layout;

	const projectName = useSelector((state) => state.general.selectedProjectName);

	useEffect(() => {
		setSelectedChoice(null);
	}, []);

	const getSelectedChoice = () => {
		switch (selectedChoice) {
			case 1:
				return <AddModule />;

			case 2:
				return <MultiModule />;

			case 3:
				return <OwnSetup />;

			case 4:
				return <GameModule />;

			default:
				break;
		}
	};

	const routes = [
		{
			path: "profile/dashboard",
			breadcrumbName: "Dashboard",
		},
		{
			path: "profile/dashboard",
			breadcrumbName: "Selected Project",
		},
		{
			path: "profile/add-module",
			breadcrumbName: "Add Module(s)",
		},
	];

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Add Module(s)"
				breadcrumb={{ routes }}
			>
				<Paragraph>Add module(s) to an existing project</Paragraph>
			</PageHeader>
			{projectName === null ? <Navigate to="/profile/projects" /> : <div />}
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
				}}
			>
				{selectedChoice === null ? (
					<Row className="module-wrapper" type="flex" justify="center" gutter={[16]}>
						<Col span={5}>
							<Card
								style={{ margin: "0 auto" }}
								className="module-card"
								onClick={() => setSelectedChoice(1)}
							>
								<Row type="flex" justify="center" align="middle">
									<div style={{ textAlign: "center" }}>
										<Col xs={24}>
											<FileAddOutlined style={{ fontSize: 30 }} />
										</Col>
										<Col style={{ fontSize: 20 }} xs={24}>
											Single-Module
										</Col>
									</div>
								</Row>
							</Card>
						</Col>
						<Col span={5}>
							<Card
								style={{ margin: "0 auto" }}
								className="module-card"
								onClick={() => setSelectedChoice(4)}
							>
								<Row type="flex" justify="center" align="middle">
									<div style={{ textAlign: "center" }}>
										<Col xs={24}>
											<PlayCircleOutlined style={{ fontSize: 30 }} />
										</Col>
										<Col style={{ fontSize: 20 }} xs={24}>
											Game Server
										</Col>
									</div>
								</Row>
							</Card>
						</Col>
						<Col span={5}>
							<Card
								style={{ margin: "0 auto" }}
								className="module-card-disabled"
								//onClick={() => setSelectedChoice(2)}
							>
								<Row type="flex" justify="center" align="middle">
									<div style={{ textAlign: "center" }}>
										<Col xs={24}>
											<BuildOutlined style={{ fontSize: 30 }} />
										</Col>
										<Col style={{ fontSize: 20 }} xs={24}>
											Multi-Module
										</Col>
									</div>
								</Row>
							</Card>
						</Col>
						<Col span={5}>
							<Card
								style={{ margin: "0 auto" }}
								className="module-card-disabled"
								//onClick={() => setSelectedChoice(3)}
							>
								<Row type="flex" justify="center" align="middle">
									<div style={{ textAlign: "center" }}>
										<Col xs={24}>
											<UserOutlined style={{ fontSize: 30 }} />
										</Col>
										<Col style={{ fontSize: 20 }} xs={24}>
											Own Setup
										</Col>
									</div>
								</Row>
							</Card>
						</Col>
					</Row>
				) : (
					getSelectedChoice()
				)}
			</Content>
		</div>
	);
}

export default ModuleSelection;
