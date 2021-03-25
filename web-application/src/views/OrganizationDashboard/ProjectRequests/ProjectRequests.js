import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PageHeader, Typography, Layout, Button, Collapse, Descriptions, Row, Col, Tag, Modal, Input } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
// Identicon
import { createAlert } from "../../../store/actions/generalActions";
import RequestEditForm from "./components/RequestEditForm/RequestEditForm";

function ProjectRequests() {
	// State
	const [projects, setProjects] = React.useState([]);
	const [acceptModalOpen, setAcceptModalOpen] = React.useState(false);
	const [editModalOpen, setEditModalOpen] = React.useState(false);
	const [declineModalOpen, setDeclineModalOpen] = React.useState(false);
	const [acceptComment, setAcceptComment] = React.useState("");
	const [declineComment, setDeclineComment] = React.useState("");
	const [refreshList, setRefreshList] = React.useState(false);

	const [keycloak] = useKeycloak();

	// Modal info state
	const [selectedProjectRequest, setSelectedProjectRequest] = React.useState(null);

	// Import sub components from antd
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Panel } = Collapse;
	const { TextArea } = Input;

	const organizationName = sessionStorage.getItem("selectedOrganizationName");
	const dispatch = useDispatch();

	useEffect(() => {
		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_GENERAL_API +
				"/organization/" +
				organizationName +
				"/project-applications",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setProjects(response.data);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshList]);

	const toggleRefresh = () => {
		setRefreshList(!refreshList);
	};

	const acceptRequest = (selectedProjectRequest) => {
		axios({
			method: "post",
			url: process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_GENERAL_API + "/organization/acceptProjectRequest",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			data: {
				projectRequestId: selectedProjectRequest.id,
				comment: acceptComment,
			},
		})
			.then(function () {
				dispatch(
					createAlert(
						"Project request accepted",
						selectedProjectRequest.member.username +
							"'s project request for the project: " +
							selectedProjectRequest.organizationProject.name +
							" has been accepted",
						"success",
						true
					)
				);
				toggleRefresh();
				setAcceptModalOpen(false);
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Project request accepting failed",
						"Couldn't accept the project application for the given project, " +
							selectedProjectRequest.organizationProject.name,
						"error",
						true
					)
				);
				setAcceptModalOpen(false);
			});
	};

	const declineRequest = (selectedProjectRequest) => {
		axios({
			method: "post",
			url:
				process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_GENERAL_API + "/organization/declineProjectRequest",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			data: {
				organizationName: organizationName,
				projectRequestId: selectedProjectRequest.id,
				comment: declineComment,
			},
		})
			.then(function () {
				dispatch(
					createAlert(
						"Project request declined",
						'The request for the project "' + selectedProjectRequest.organizationProject.name + '" has been declined',
						"success",
						true
					)
				);
				toggleRefresh();
				setDeclineModalOpen(false);
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Project rejection failed",
						"Couldn't decline the project request for the project " + selectedProjectRequest.organizationProject.name,
						"error",
						true
					)
				);
				setDeclineModalOpen(false);
			});
	};

	const routes = [
		{
			path: "organization/dashboard",
			breadcrumbName: "Dashboard",
		},
		{
			path: "organization/project-requests",
			breadcrumbName: "Organization Project Requests",
		},
	];

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title={organizationName + " Project Requests"}
				breadcrumb={{ routes }}
			>
				<Paragraph>List of all the project requests that wants to be affiliated with the organization</Paragraph>
			</PageHeader>
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 20px",
				}}
			>
				<div
					style={{
						padding: 24,
						background: "#fff",
						maxWidth: 1000,
						width: "100%",
						margin: "0 auto",
					}}
				>
					<Collapse>
						{projects.map((project) => (
							<Panel
								header={project.member.username + " - " + project.organizationProject.name}
								key={project.id}
								extra={project.created}
							>
								<Row gutter={[24, 0]}>
									<Col xs={24} md={5}>
										<img
											style={{
												width: "100%",
												border: "1px solid black",
											}}
											src={
												"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
											}
											alt="Applicant Profile"
										/>
									</Col>
									<Col xs={24} md={19}>
										<Descriptions title="Project Application Details" layout="horizontal">
											<Descriptions.Item label="Submitted By">{project.member.username}</Descriptions.Item>
											<Descriptions.Item label="Project Name">
												{project.organizationProject.name}
											</Descriptions.Item>
											<Descriptions.Item label="Type">{project.organizationProject.type}</Descriptions.Item>

											<Descriptions.Item label="Tags">
												{project.organizationProject.tags.length > 1 ? (
													project.organizationProject.tags.split(",").map((tag) => (
														<span key={tag} style={{ display: "inline-block" }}>
															<Tag color="blue">{tag}</Tag>
														</span>
													))
												) : (
													<div />
												)}
											</Descriptions.Item>
										</Descriptions>

										<Descriptions layout="horizontal">
											<Descriptions.Item label="Description">
												{project.organizationProject.description}
											</Descriptions.Item>
										</Descriptions>

										<Descriptions layout="horizontal">
											<Descriptions.Item label="Authors">
												<b>{project.organizationProject.authors}</b>
											</Descriptions.Item>
										</Descriptions>

										<Descriptions layout="horizontal">
											<Descriptions.Item label="Links">
												<b>{project.organizationProject.links}</b>
											</Descriptions.Item>
										</Descriptions>

										<Descriptions layout="horizontal">
											<Descriptions.Item label="Comment">{project.comment}</Descriptions.Item>
										</Descriptions>
										<div style={{ float: "right", padding: 10 }}>
											<Button
												style={{ marginRight: 10 }}
												type="danger"
												onClick={() => {
													setSelectedProjectRequest(project);
													setDeclineModalOpen(true);
												}}
											>
												Decline Request
											</Button>
											<Button
												style={{ marginRight: 10 }}
												onClick={() => {
													setSelectedProjectRequest(project);
													setEditModalOpen(true);
												}}
											>
												Edit
											</Button>
											<Button
												style={{ marginRight: 10 }}
												type="primary"
												onClick={() => {
													setSelectedProjectRequest(project);
													setAcceptModalOpen(true);
												}}
											>
												Accept Request
											</Button>
											<Button disabled type="primary">
												Accept & Verify
											</Button>
										</div>
									</Col>
								</Row>
							</Panel>
						))}
					</Collapse>
					{/* Accept Modal */}
					{selectedProjectRequest !== null ? (
						<Modal
							title={"Accept request from " + selectedProjectRequest.member.username + "?"}
							centered
							visible={acceptModalOpen}
							onOk={() => acceptRequest(selectedProjectRequest)}
							onCancel={() => setAcceptModalOpen(false)}
						>
							<p>
								By accepting this project. <b>{selectedProjectRequest.member.username}</b> will be notified on
								email that the project: {selectedProjectRequest.organizationProject.name} has been accepted
							</p>
							<TextArea
								placeholder="Comment..."
								allowClear
								autoSize={{ minRows: 3, maxRows: 6 }}
								onChange={(e) => setAcceptComment(e.target.value)}
							/>
						</Modal>
					) : (
						<div />
					)}
					{/* Edit Modal */}
					{selectedProjectRequest !== null ? (
						<Modal
							title={'Edit "' + selectedProjectRequest.organizationProject.name + '"?'}
							centered
							visible={editModalOpen}
							onCancel={() => setEditModalOpen(false)}
							footer={null}
						>
							<RequestEditForm
								request={selectedProjectRequest}
								setOpenEditModal={setEditModalOpen}
								toggleRefresh={toggleRefresh}
							/>
						</Modal>
					) : (
						<div />
					)}
					{/* Decline Modal */}
					{selectedProjectRequest !== null ? (
						<Modal
							title={
								'Decline project request for "' +
								selectedProjectRequest.organizationProject.name +
								'" from ' +
								selectedProjectRequest.member.username +
								"?"
							}
							centered
							visible={declineModalOpen}
							onOk={() => declineRequest(selectedProjectRequest)}
							onCancel={() => setDeclineModalOpen(false)}
						>
							<p>
								By declining the request, {selectedProjectRequest.member.username} will be notified. You can add a
								comment which will be sent with the email. Can include a reason why the project request was
								declined.
							</p>
							<TextArea
								placeholder="Comment..."
								allowClear
								autoSize={{ minRows: 3, maxRows: 6 }}
								onChange={(e) => setDeclineComment(e.target.value)}
							/>
						</Modal>
					) : (
						<div />
					)}
				</div>
			</Content>
		</div>
	);
}

export default ProjectRequests;
