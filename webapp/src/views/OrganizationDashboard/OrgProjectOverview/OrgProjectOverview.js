import { Button, Card, Col, Empty, Layout, Modal, PageHeader, Row, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import {Link, Redirect, useParams} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import { GlobalOutlined, SettingOutlined } from "@ant-design/icons";
import Moment from "moment";


function OrgProjectOverview() {
	// State
	const [project, setProject] = React.useState({});
	const [projectModules, setProjectModules] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	const [links, setLinks] = React.useState([]);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [selectedModule, setSelectedModule] = React.useState(null);

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Meta } = Card;

	const [keycloak] = useKeycloak();

	const { organizationName } = useParams();
	const projectId = sessionStorage.getItem("selectedProjectId");

	useEffect(() => {
		setSelectedModule(null);
		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_API +
				"/organization/" +
				organizationName +
				"/overview/" +
				projectId,
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			console.log("DATA:", response.data);
			setProject(response.data);
			if (response.data.tags) {
				setTags(response.data.tags.split(","));
			} else {
				setTags([]);
			}
			if (response.data.links) {
				setLinks(response.data.links.split(","));
			} else {
				setLinks([]);
			}
		});
	}, []);


	const routes = [
		{
			path: "organization",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/dashboard/" + organizationName,
			breadcrumbName: "Organization Projects",
		},
		{
			path: "/overview/" + project.id,
			breadcrumbName: project.name,
		},
	];

	const title = (
		<div>
			{project.name}
			<GlobalOutlined style={{ marginLeft: 20 }} />
			{project.private ? " Private" : " Public"}
		</div>
	);


	return (
		<div style={{ width: "100%", height: "auto" }}>
			{project.id === null ? <Redirect to="/organization/dashboard" /> : <div />}
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
					paddingBottom: 50,
				}}
				title={title}
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
				extra={[
					/*<Link key={0} style={{ marginLeft: 10, marginRight: 10 }} to="/profile/projects/add-module">
						<Button type="link">
							<PlusCircleOutlined /> Add Module
						</Button>
					</Link>,*/
					/*<Link key={1} style={{ marginLeft: 10, marginRight: 10 }} to="#">
						<Icon type="download" /> Download
					</Link>,*/
					// <Link
					// 	id="project-settings-link"
					// 	key={2}
					// 	style={{ marginLeft: 10, marginRight: 10 }}
					// 	to={"/organization/dashboard/" + organizationName + "/overview/"+ project.id + "/settings"}
					// >
					// 	<SettingOutlined /> Settings
					// </Link>,
				]}
			>
				<Paragraph>{project.description}</Paragraph>
				<Paragraph style={{ color: "blue" }}>
					{links.length > 0 ? (
							links.map((link) => (
						<a key={link} href={link} target="_blank" rel="noopener noreferrer">
							 {link}
						</a>))
					) : (
						<div />
					)}
				</Paragraph>
				<div>
					<div style={{ float: "left" }}>
						{tags.length > 0 ? (
							tags.map((tag) => (
								<span key={tag} style={{ display: "inline-block" }}>
									<Tag color="blue">{tag}</Tag>
								</span>
							))
						) : (
							null
						)}
					</div>
					<Paragraph style={{ float: "right" }}>Last updated {Moment(project.lastUpdated).format('DD/MM/yyyy')}</Paragraph>
				</div>
			</PageHeader>
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
				}}
			>
				{projectModules.length > 0 ? (
					<Row gutter={[24, 24]}>
						{projectModules.map((module) => (
							<Col xs={24} lg={8} xl={6} key={module.id}>
								<Card
									hoverable
									style={{ width: 240 }}
									bodyStyle={{ padding: 0 }}
									actions={[
										/*<Icon
											type="download"
											key="download"
											onClick={() => message.success("Download button hit")}
										/>,
										<Icon
											type="edit"
											key="edit"
											onClick={() => message.success("Edit button hit")}
										/>,*/
									]}
								>
									<div
										onClick={() => {
											setSelectedModule(module);
											setModalOpen(true);
										}}
									>
										<img
											style={{ width: "100%" }}
											alt="Module"
											src={
												"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
											}
										/>
										<Meta
											style={{ padding: 20 }}
											title={module.name}
											description={
												module.desc !== null ? <Paragraph ellipsis>{module.desc}</Paragraph> : <div />
											}
										/>
									</div>
								</Card>
							</Col>
						))}
					</Row>
				) : (
					<Empty
						imageStyle={{
							height: 150,
						}}
						description="Project contains no modules"
					>

					</Empty>
				)}
				{selectedModule !== null ? (
					<Modal
						title={selectedModule.name}
						centered
						visible={modalOpen}
						onCancel={() => setModalOpen(false)}
						footer={[
							<Button key="close" onClick={() => setModalOpen(false)}>
								Close
							</Button>,
						]}
					>
						<img
							style={{ width: "100%" }}
							alt="Module"
							src={
								"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
							}
						/>
						<p style={{ marginTop: 20 }}>{selectedModule.desc}</p>
						{selectedModule.framework !== null ? (
							<p>
								<b>Framework: </b>
								{selectedModule.framework}
							</p>
						) : (
							<div />
						)}
						<p>
							<b>Language: </b>
							{selectedModule.configType.split("-")[0]} {selectedModule.configType.split("-")[1]}
						</p>
						<p>
							<b>Port: </b>
							{selectedModule.port}
						</p>
						<p>
							<b>Source Code: Not available</b>
							{/* <a
							href={selectedModule.sourceCode}
							rel="noopener noreferrer"
							target="_blank"
						>
							{selectedModule.sourceCode}
						</a> */}
						</p>
					</Modal>
				) : (
					<div />
				)}
			</Content>
		</div>
	);
}

export default OrgProjectOverview;
