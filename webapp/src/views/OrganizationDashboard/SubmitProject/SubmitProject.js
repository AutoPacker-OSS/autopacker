import {
	Avatar,
	Button,
	Card,
	Form,
	Input,
	Layout,
	Modal,
	PageHeader,
	Radio,
	Tooltip,
	Typography,
} from "antd";
import React, {useContext, useEffect} from "react";
import { useDispatch} from "react-redux";
import {Navigate, useParams} from "react-router-dom";
import { createAlert, selectMenuOption } from "../../../store/actions/generalActions";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";


import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {useApi} from "../../../hooks/useApi";

// TODO - refactor. A lot of code duplicated from NewOrgProject.js?
function SubmitProject(props) {
	// Form state
	const [actualProject, setActualProject] = React.useState("");
	const [comment, setComment] = React.useState("");

	// Project selection states
	const [projects, setProjects] = React.useState([]);
	const [selectedProject, setSelectedProject] = React.useState(null);
	const [selectedRadio, setSelectedRadio] = React.useState(null);

	// Controller state
	const [modalOpen, setModalOpen] = React.useState(false);

	// Conditional state
	const [redirect, setRedirect] = React.useState(false);
	

	// Import sub components from antd
	const { TextArea } = Input;
	const { Content } = Layout;
	const { Paragraph, Text } = Typography;

	const {get, post} = useApi();

	const { organizationName } = useParams();
	const dispatch = useDispatch();
	const { user, isAuthenticated, isLoading } = useAuth0();

	useEffect(() => {
		get(`/projects`)
			.then(resp => {
				setProjects(resp.data);
			});
	}, [user]);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (user.email_verified) {
			post(`/organization/submitProject`, {
				organizationName: organizationName,
				projectId: actualProject.id,
				comment: comment,
			}).then(function () {
				dispatch(
					createAlert(
						"Project Request Submitted",
						"You have successfully submitted a project. You will receive a notification on email when the request has been handled.",
						"success",
						true
					)
				);
				dispatch(selectMenuOption("9"));
				setRedirect(true);
			}).catch(() => {
				dispatch(
					createAlert(
						"Project Request Failed",
						"Something went wrong while trying to submit the project. There might be an existing project with the specified name",
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

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		},
	};

	const routes = [
		{
			path: "organization/dashboard",
			breadcrumbName: "Dashboard",
		},
		{
			path: "organization/submit-project",
			breadcrumbName: "Submit Project",
		},
	];

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Submit Project"
				breadcrumb={{ routes }}
			>
				<Paragraph>Form to submit a project to the organization, when you submit the organization takes over the ownership of the project</Paragraph>
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
				{redirect ? (
					<Navigate to={"/organization/submissions/" + organizationName} />
				) : (
					<div />
				)}
				{/* TODO Redirect to user organization submissions (list of all his/hers submission) */}
				{/* {redirect ? <Redirect to="/profile/projects" /> : <div />} */}
				<Form {...formItemLayout}>
					{/* Comment Input */}
					<Form.Item
						label={
							<span>
								Comment&nbsp;
								<Tooltip title="Comment about the project, this will be shown when the project get reviewed before it get added to the organization.">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							maxWidth: 400,
						}}
					>
						<TextArea onChange={(event) => setComment(event.target.value)} />
					</Form.Item>
					{/* Project Link option */}
					<Form.Item
						label={
							<span>
								Project&nbsp;
								<Tooltip title="The actual project you wish to submit to the organization">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
								message: "Please specify the actual project you wish to submit",
							},
						]}
					>
						<div>
							<Button
								type="primary"
								icon={<UploadOutlined />}
								size={"large"}
								onClick={() => setModalOpen(true)}
							/>
							<Text>
								{selectedProject !== null ? (
									" " + selectedProject.name
								) : (
									<div />
								)}
							</Text>
						</div>
					</Form.Item>
					{/* Project Selection Modal */}
					<Modal
						title="Select what project you want to submit."
						centered
						visible={modalOpen}
						onOk={() => {
							setActualProject(selectedProject);
							setModalOpen(false);
						}}
						onCancel={() => {
							setActualProject(null);
							setSelectedProject(null);
							setSelectedRadio(null);
							setModalOpen(false);
						}}
					>
						<Radio.Group style={{ width: "100%" }} value={selectedRadio}>
							{projects.map((project) => (
								<Card
									key={project.id}
									hoverable
									style={{ height: "auto", marginBottom: 10, width: "100%" }}
									size="small"
									onClick={() => {
										setSelectedProject(project);
										setSelectedRadio(project.id);
										console.log(project.id);
									}}
								>
									<div>
										<Avatar
											size="large"
											icon="user"
											style={{
												float: "left",
												verticalAlign: "middle",
											}}
										/>
										<div style={{ verticalAlign: "middle" }}>
											<Text style={{ marginLeft: 16 }}>
												{project.name}
											</Text>
											<Radio value={project.id} style={{ float: "right" }} />
										</div>
									</div>
								</Card>
							))}
						</Radio.Group>
					</Modal>
					{/* Button Section */}
					<div style={{ width: "100%", textAlign: "center" }}>
						<Button
							disabled={
								 selectedProject === null
							}
							type="primary"
							onClick={(e) => handleSubmit(e)}
						>
							Submit Project
						</Button>
					</div>
				</Form>
			</Content>
		</div>
	);
}

export default SubmitProject;
