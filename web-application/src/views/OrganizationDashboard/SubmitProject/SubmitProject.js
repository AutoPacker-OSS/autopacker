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
	Tag,
	Tooltip,
	Typography,
} from "antd";
import { TweenOneGroup } from "rc-tween-one";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { createAlert, selectMenuOption } from "../../../store/actions/generalActions";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

import AuthorInput from "./components/AuthorInput";
import LinkInput from "./components/LinkInput";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";

// TODO - refactor. A lot of code duplicated from NewProject.js?
function SubmitProject(props) {
	// Form state
	const [projectName, setProjectName] = React.useState("");
	const [desc, setDesc] = React.useState("");
	const [actualProject, setActualProject] = React.useState("");
	const [type, setType] = React.useState("");
	const [authors, setAuthors] = React.useState([]);
	const [links, setLinks] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	const [comment, setComment] = React.useState("");

	// Project selection states
	const [projects, setProjects] = React.useState([]);
	const [selectedProject, setSelectedProject] = React.useState(null);
	const [selectedRadio, setSelectedRadio] = React.useState(null);

	// Controller state
	const [tagInput, setTagInput] = React.useState("");
	const [modalOpen, setModalOpen] = React.useState(false);

	// Conditional state
	const [redirect, setRedirect] = React.useState(false);

	// validation
	const [validName, setValidName] = React.useState(false);
	const [nameValidStatus, setNameValidStatus] = React.useState("");
	const [nameHelpText, setNameHelpText] = React.useState("");

	// Import sub components from antd
	const { TextArea } = Input;
	const { Content } = Layout;
	const { Paragraph, Text } = Typography;

	const [keycloak] = useKeycloak();

	const organizationName = sessionStorage.getItem("selectedOrganizationName");
	const dispatch = useDispatch();

	useEffect(() => {
		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_FILE_DELIVERY_API +
				"/projects",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setProjects(response.data);
		});
	}, []);

	const removeTag = (removedTag) => {
		const tagsa = tags.filter((tag) => tag !== removedTag);
		setTags(tagsa);
	};

	const handleTagInputConfirm = () => {
		let tagsa = tags;
		if (tagInput && tagsa.indexOf(tagInput) === -1) {
			tagsa = [...tags, tagInput];
		}
		setTags(tagsa);
		setTagInput("");
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (keycloak.idTokenParsed.email_verified) {
			axios({
				method: "post",
				url:
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_GENERAL_API +
					"/organization/submitProject",
				headers: {
					Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
				},
				data: {
					organizationName: organizationName,
					projectName: projectName,
					desc: desc,
					type: type,
					authors: authors,
					links: links,
					tags: tags,
					actualProject: actualProject.id,
					comment: comment,
				},
			})
				.then(function () {
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
				})
				.catch(() => {
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

	const validateName = (value) => {
		console.log(value);
		if (value.trim().length <= 0) {
			setValidName(false);
			setNameValidStatus("error");
			setNameHelpText("Please name your project");
		} else if (/^[a-zA-Z0-9-]+$/.test(value)) {
			setValidName(true);
			setNameValidStatus("success");
			setNameHelpText("");
		} else {
			setValidName(false);
			setNameValidStatus("error");
			setNameHelpText(
				"Only letters, numbers and dashes are allowed. Spaces and special characters not allowed"
			);
		}
		setProjectName(value);
	};

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
				<Paragraph>Form to submit a project to the organization</Paragraph>
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
					<Redirect to={"/organization/submissions/" + organizationName} />
				) : (
					<div />
				)}
				{/* TODO Redirect to user organization submissions (list of all his/hers submission) */}
				{/* {redirect ? <Redirect to="/profile/projects" /> : <div />} */}
				<Form {...formItemLayout}>
					{/* Project Name */}
					<Form.Item
						label="Project Name"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input onChange={(event) => validateName(event.target.value)} />
					</Form.Item>
					{/* Project Description */}
					<Form.Item
						label="Project Description"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
					>
						<TextArea onChange={(e) => setDesc(e.target.value)} />
					</Form.Item>
					{/* Project Type */}
					<Form.Item
						label="Project Type"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Radio.Group
							onChange={(e) => {
								setType(e.target.value);
							}}
						>
							<Radio value="Personal">Personal</Radio>
							<Radio value="Bachelor">Bachelor</Radio>
							<Radio value="Lecture">Lecture</Radio>
						</Radio.Group>
					</Form.Item>
					{/* Tags Section (handling & displaying) */}
					<Form.Item
						label={
							<span>
								Tags&nbsp;
								<Tooltip title="Tags can be used to identify and search for projects">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
					>
						<Input
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onPressEnter={handleTagInputConfirm}
						/>
					</Form.Item>
					<div
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							maxWidth: 400,
							width: "100%",
							textAlign: "center",
							marginBottom: 16,
						}}
					>
						<TweenOneGroup
							enter={{
								scale: 0.8,
								opacity: 0,
								type: "from",
								duration: 100,
								onComplete: (e) => {
									e.target.style = "";
								},
							}}
							leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
							appear={false}
						>
							{tags.map((tag) => (
								<span key={tag} style={{ display: "inline-block" }}>
									<Tag
										color="blue"
										closable
										onClose={(e) => {
											e.preventDefault();
											removeTag(tag);
										}}
									>
										{tag}
									</Tag>
								</span>
							))}
						</TweenOneGroup>
					</div>
					{/* Author(s) Section */}
					{/* <AuthorInput updateAuthors={setAuthors} /> */}
					<Form.Item
						label={
							<span>
								Author(s)&nbsp;
								<Tooltip title="Authors are shown with the projects they are assigned to. So here you can add your username(s), real name(s) or email(s). If you wish to stay anonymous, but still want to show yourself, you can use a pseudo-name">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
					>
						<Input disabled placeholder="Currently not working..." />
					</Form.Item>
					{/* Link(s) Section */}
					{/* <LinkInput updateLinks={setLinks} /> */}
					<Form.Item
						label={
							<span>
								Link(s)&nbsp;
								<Tooltip title="Here you can provide links to either project repo, related resources and/or the website that hosts the project if it is hosted">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
					>
						<Input disabled placeholder="Currently not working..." />
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
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
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
									" " + selectedProject.projectName
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
												{project.projectName}
											</Text>
											<Radio value={project.id} style={{ float: "right" }} />
										</div>
									</div>
								</Card>
							))}
						</Radio.Group>
					</Modal>
					{/* Comment Input */}
					<Form.Item
						label={
							<span>
								Comment&nbsp;
								<Tooltip title="Can be anything, why you want the selected role, why you want to join etc.">
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
					{/* Button Section */}
					<div style={{ width: "100%", textAlign: "center" }}>
						<Button
							disabled={
								!validName || type.trim().length <= 0 || selectedProject === null
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
