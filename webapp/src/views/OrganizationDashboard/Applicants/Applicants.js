import { Button, Col, Collapse, Descriptions, Input, Layout, Modal, PageHeader, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
// Identicon
import Identicon from "../../../assets/image/download.png";
import { createAlert } from "../../../store/actions/generalActions";
import {useParams} from "react-router-dom";

function Applicants() {
	// State
	const [applicants, setApplicants] = React.useState([]);
	const [acceptModalOpen, setAcceptModalOpen] = React.useState(false);
	const [declineModalOpen, setDeclineModalOpen] = React.useState(false);
	const [declineComment, setDeclineComment] = React.useState("");
	const [refreshList, setRefreshList] = React.useState(false);

	// Modal info state
	const [selectedApplicantUsername, setSelectedApplicantUsername] = React.useState("");
	const [selectedApplicantName, setSelectedApplicantName] = React.useState("");
	const [selectedApplicantRole, setSelectedApplicantRole] = React.useState("");

	const [keycloak] = useKeycloak();

	const { organizationName } = useParams();

	const dispatch = useDispatch();

	// Import sub components from antd
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Panel } = Collapse;
	const { TextArea } = Input;

	useEffect(() => {
		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_GENERAL_API +
				"/organization/" +
				organizationName +
				"/member-applications",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setApplicants(response.data);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const routes = [
		{
			path: "organization/dashboard",
			breadcrumbName: "Dashboard",
		},
		{
			path: "organization/applicants",
			breadcrumbName: "Organization Applicants",
		},
	];

	const acceptRequest = (username) => {
		axios({
			method: "post",
			url: process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_GENERAL_API + "/organization/acceptMemberRequest",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			data: {
				organizationName: organizationName,
				username: username,
			},
		})
			.then(() => {
				dispatch(createAlert("Member accepted", username + "'s member application have been accepted", "success", true));
				setRefreshList(true);
				setAcceptModalOpen(false);
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Member accepting failed",
						"Couldn't accept the member application for the given user, " + username,
						"error",
						true
					)
				);
				setAcceptModalOpen(false);
			});
	};

	const declineRequest = (username) => {
		axios({
			method: "post",
			url: process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_GENERAL_API + "/organization/declineMemberRequest",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			data: {
				organizationName: organizationName,
				username: username,
				comment: declineComment,
			},
		})
			.then(() => {
				dispatch(
					createAlert(
						"Member application declined",
						username + "'s member application have been declined",
						"success",
						true
					)
				);
				setRefreshList(true);
				setDeclineModalOpen(false);
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Member rejection failed",
						"Couldn't reject the member application for the given user, " + username,
						"error",
						true
					)
				);
				setDeclineModalOpen(false);
			});
	};

	const openAcceptModal = (applicantUsername, applicantName, applicantRole) => {
		setSelectedApplicantUsername(applicantUsername);
		setSelectedApplicantName(applicantName);
		setSelectedApplicantRole(applicantRole);
		setAcceptModalOpen(true);
	};

	const openDeclineModal = (applicantUsername, applicantName) => {
		setSelectedApplicantUsername(applicantUsername);
		setSelectedApplicantName(applicantName);
		setDeclineModalOpen(true);
	};

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title={organizationName + " Applicants"}
				breadcrumb={{ routes }}
			>
				<Paragraph>List of all applicants that want to be affiliated with the organization</Paragraph>
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
						{applicants.map((applicant) => (
							<Panel header={applicant.member.username} key={applicant.id} extra={applicant.created}>
								<Row gutter={[24, 0]}>
									<Col xs={24} md={4}>
										<img
											style={{ maxHeight: 100, border: "1px solid black" }}
											src={Identicon}
											alt="Applicant Profile"
										/>
									</Col>
									<Col xs={24} md={20}>
										<Descriptions title="Applicant Details">
											<Descriptions.Item label="Name">{applicant.member.name}</Descriptions.Item>
											<Descriptions.Item label="Role">{applicant.member.role.name}</Descriptions.Item>
											<Descriptions.Item label="Comment">{applicant.comment}</Descriptions.Item>
										</Descriptions>
										<div style={{ float: "right", padding: 10 }}>
											<Button
												style={{ marginRight: 10 }}
												type="danger"
												onClick={() => openDeclineModal(applicant.member.username, applicant.member.name)}
											>
												Decline Request
											</Button>
											<Button
												type="primary"
												onClick={() =>
													openAcceptModal(
														applicant.member.username,
														applicant.member.name,
														applicant.member.role.name
													)
												}
											>
												Accept Request
											</Button>
										</div>
									</Col>
								</Row>
							</Panel>
						))}
					</Collapse>
					{/* Accept Modal */}
					<Modal
						title={"Accept request from " + selectedApplicantName + "?"}
						centered
						visible={acceptModalOpen}
						onOk={() => acceptRequest(selectedApplicantUsername)}
						onCancel={() => setAcceptModalOpen(false)}
					>
						<p>
							By accepting this applicant. <b>{selectedApplicantName}</b> will be added to the organization with the
							role: <b>{selectedApplicantRole}</b>. A email notification will be sent to the applicant.
						</p>
					</Modal>
					{/* Decline Modal */}
					<Modal
						title={"Decline request from " + selectedApplicantName + "?"}
						centered
						visible={declineModalOpen}
						onOk={() => declineRequest(selectedApplicantUsername)}
						onCancel={() => setDeclineModalOpen(false)}
					>
						<p>
							By declining the request, the applicant will be notified. You can add a comment which will be sent
							with the email. Can include a reason why the application is declined.
						</p>
						<TextArea
							placeholder="Comment..."
							allowClear
							autoSize={{ minRows: 3, maxRows: 6 }}
							onChange={(e) => setDeclineComment(e.target.value)}
						/>
					</Modal>
				</div>
			</Content>
		</div>
	);
}

export default Applicants;
