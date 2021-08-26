import {
	Button,
	Col,
	Collapse,
	Descriptions,
	Layout,
	Modal,
	PageHeader,
	Row,
	Tag,
	Typography,
} from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAlert } from "../../../store/actions/generalActions";
import {useOktaAuth} from "@okta/okta-react";
import axios from "axios";

import RequestEditForm from "./components/RequestEditForm/RequestEditForm";
import {useParams} from "react-router-dom";

function Submissions() {
	// State
	const [requests, setRequests] = React.useState([]);
	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
	const [openEditModal, setOpenEditModal] = React.useState();
	const [refreshList, setRefreshList] = React.useState(false);

	// Modal info state
	const [selectedRequest, setSelectedRequest] = React.useState(null);

	// Import sub components from antd
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Panel } = Collapse;

	const { authState } = useOktaAuth();

	const { organizationName } = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		// TODO UNCOMMENT THIS AND FIX THIS SHIT
		// if (organizationName) {
		// 	axios({
		// 		method: "get",
		// 		url:
		// 			process.env.REACT_APP_APPLICATION_URL +
		// 			process.env.REACT_APP_API +
		// 			"/organization/" +
		// 			organizationName +
		// 			"/project-applications/" +
		// 			keycloak.idTokenParsed.preferred_username,
		// 		headers: {
		// 			Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
		// 		},
		// 	}).then(function (response) {
		// 		console.log("DATA:", response.data);
		// 		setRequests(response.data);
		// 	});
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [organizationName, refreshList]);

	const toggleRefresh = () => {
		setRefreshList(!refreshList);
	};

	const routes = [
		{
			path: "organization/dashboard",
			breadcrumbName: "Dashboard",
		},
		{
			path: "organization/project-requests",
			breadcrumbName: "Your Project Submissions",
		},
	];

	const deleteRequest = (applicationId) => {
		// TODO Change method to DELETE and equivalent on general-api backend service
		axios({
			method: "delete",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_API +
				"/organization/" +
				organizationName +
				"/delete-project-application/" +
				applicationId,
			headers: {
				Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
			},
		})
			.then(() => {
				dispatch(
					createAlert(
						"Request Deleted",
						"You have successfully deleted the project request",
						"success",
						true
					)
				);
				toggleRefresh();
				setOpenDeleteModal(false);
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Request Deletion Failed",
						"Failed to delete the project request",
						"error",
						true
					)
				);
				setOpenDeleteModal(false);
			});
	};

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Your Project Submissions"
				breadcrumb={{ routes }}
			>
				<Paragraph>
					List of all the project submissions you have with this organization
				</Paragraph>
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
						{requests.map((request) => (
							<Panel
								header={
									request.project.owner.username +
									" - " +
									request.project.name
								}
								key={request.id}
								extra={request.created}
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
										<Descriptions
											title="Project Application Details"
											layout="horizontal"
										>
											<Descriptions.Item label="Submitted By">
												{request.project.owner.username}
											</Descriptions.Item>
											<Descriptions.Item label="Project Name">
												{request.project.name}
											</Descriptions.Item>
											{/* TODO Removed? */}
											{/*<Descriptions.Item label="Type">*/}
											{/*	{request.project.type}*/}
											{/*</Descriptions.Item>*/}

											<Descriptions.Item label="Tags">
												{request.project.tags !== null && request.project.tags.length > 1 ? (
													request.project.tags
														.split(",")
														.map((tag) => (
															<span
																key={tag}
																style={{ display: "inline-block" }}
															>
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
												{request.project.description}
											</Descriptions.Item>
										</Descriptions>

										{/* TODO Not used anymore */}
										{/*<Descriptions layout="horizontal">*/}
										{/*	<Descriptions.Item label="Authors">*/}
										{/*		<b>{request.project.authors}</b>*/}
										{/*	</Descriptions.Item>*/}
										{/*</Descriptions>*/}

										{/*<Descriptions layout="horizontal">*/}
										{/*	<Descriptions.Item label="Links">*/}
										{/*		<b>{request.project.links}</b>*/}
										{/*	</Descriptions.Item>*/}
										{/*</Descriptions>*/}

										<Descriptions layout="horizontal">
											<Descriptions.Item label="Comment">
												{request.comment}
											</Descriptions.Item>
										</Descriptions>
										<div style={{ float: "right", padding: 10 }}>
											<Button
												style={{ marginRight: 10 }}
												type="danger"
												onClick={() => {
													setSelectedRequest(request);
													setOpenDeleteModal(true);
												}}
											>
												Delete Request
											</Button>
											<Button
												onClick={() => {
													setSelectedRequest(request);
													setOpenEditModal(true);
												}}
											>
												Edit
											</Button>
										</div>
									</Col>
								</Row>
							</Panel>
						))}
					</Collapse>
					{/* Delete Modal */}
					{selectedRequest !== null ? (
						<Modal
							title={
								'Delete "' + selectedRequest.project.name + '" request?'
							}
							centered
							visible={openDeleteModal}
							onOk={() => deleteRequest(selectedRequest.id)}
							onCancel={() => setOpenDeleteModal(false)}
						>
							<p>Are you sure you want to delete this project request?</p>
						</Modal>
					) : (
						<div />
					)}
					{/* Edit Modal */}
					{selectedRequest !== null ? (
						<Modal
							title={'Edit "' + selectedRequest.project.name + '"?'}
							centered
							visible={openEditModal}
							onCancel={() => setOpenEditModal(false)}
							footer={null}
						>
							<RequestEditForm
								request={selectedRequest}
								setOpenEditModal={setOpenEditModal}
								toggleRefresh={toggleRefresh}
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

export default Submissions;
