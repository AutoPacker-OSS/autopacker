import { Button, Card, Col, Empty, Layout, Modal, PageHeader, Row, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import {Link, Redirect, useParams} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import { GlobalOutlined, SettingOutlined } from "@ant-design/icons";
import Moment from "moment";
import {createAlert, selectMenuOption} from "../../../store/actions/generalActions";
import {useDispatch} from "react-redux";


function PreSubmissionOverview() {
	// State
	const [project, setProject] = React.useState({});
	const [projectModules, setProjectModules] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	const [desc, setDesc] = React.useState("");
	const [name, setName] = React.useState("");
	const [links, setLinks] = React.useState([]);
	const [authors, setAuthors] = React.useState([]);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [selectedModule, setSelectedModule] = React.useState(null);
	const [redirect, setRedirect] = React.useState(false);

	//Modal Control
	const [deleteModalStatus, setDeleteModalStatus] = React.useState(false);
	const [submitModalStatus, setSubmitModalStatus] = React.useState(false);

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Meta } = Card;
	const dispatch = useDispatch();

	const [keycloak] = useKeycloak();

	const { organizationName } = useParams();
	const projectId = sessionStorage.getItem("selectedProjectId");

	useEffect(() => {
		setSelectedModule(null);
		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_GENERAL_API  +
				"/organization/" +
				organizationName +
				"/projectId/" +
				projectId,
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setProject(response.data);
			setTags(response.data.tags.split(","));
			setLinks(response.data.links.split(","));
			setAuthors(response.data.authors.split(","));
			setDesc(response.data.description);
			setName(response.data.name);
			console.log(response.data);
		});
	}, []);


	const routes = [
		{
			path: "organization",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/organization/pre-submission/" + organizationName,
			breadcrumbName: "Pre-Submissions",
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

	const closeDeleteModal = () => {
		setSubmitModalStatus(false);
		setDeleteModalStatus(false)

	}


	const handleSubmit = (event) => {
		event.preventDefault();
		if (keycloak.idTokenParsed.email_verified) {
			axios({
				method: "post",
				url: process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_GENERAL_API + "/organization/submitProject",
				headers: {
					Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
				},
				data: {
					organizationName: organizationName,
					user: keycloak.idTokenParsed.preferred_username,
					authors: authors,
					actualProject: projectId,
					projectName: name,
					type: "None",
					desc: desc,
					links: links,
					tags: tags,
					comment: "Test",
				},
			})
				.then(function () {
					dispatch(
						createAlert(
							"Project Request Submitted",
							"You have successfully submitted your project to the organization.",
							"success",
							true
						)
					);
					dispatch(selectMenuOption("11"));
					axios({
						method: "post",
						url: process.env.REACT_APP_APPLICATION_URL +
							process.env.REACT_APP_GENERAL_API + "/organization/submitted",
						headers: {
							Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
						},
						data: {
							organizationName:organizationName,
							projectId: projectId,
						},
					})
					setRedirect(true);
				})
				.catch(() => {
					dispatch(
						createAlert(
							"Project Submission Failed",
							"Submission failed, please try again",
							"error",
							true
						)
					);
				});
		} else {
			dispatch(
				createAlert(
					"Project submission failed",
					"You can't submit a project without verifying your account. Please check your email inbox for a verification email, and follow the instructions.",
					"warning",
					true
				)
			);
		}
	};

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

					<Button key="submit-project"
							onClick={() => setSubmitModalStatus(true)}>Submit</Button>,
					<Button danger
							key="delete-project"
							onClick={() => setDeleteModalStatus(true)}>Delete</Button>
				]}
			>
				{redirect ? <Redirect to={"/organization/submissions/" + organizationName}  /> : <div />}
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
							<div />
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

				{deleteModalStatus === true ? (
					<Modal
						title={'Delete "' + project.name + '"?'}
						centered
						visible={deleteModalStatus}
						onOk={() => closeDeleteModal()}
						okText="Yes"
						okType="danger"
						onCancel={() => closeDeleteModal()}
					>
						<Paragraph>Are you sure you want to delete this project?</Paragraph>
					</Modal>
				) : (
					<div />
				)}
				{submitModalStatus === true ? (
					<Modal
						title={'Want to submit "' + project.name + '"?'}
						centered
						visible={submitModalStatus}
						onOk={(e) => handleSubmit(e)}
						okText="Yes"
						onCancel={() => closeDeleteModal()}
					>
						<Paragraph>Are you sure you want to submit this project?</Paragraph>
					</Modal>
				) : (
					<div />
				)}
			</Content>
		</div>
	);
}

export default PreSubmissionOverview;
