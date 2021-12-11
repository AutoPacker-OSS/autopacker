import { Button, Form, Input, Layout, PageHeader, Radio, Tag, Tooltip, Typography } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import React, {useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { createAlert } from "../../../store/actions/generalActions";
import axios from "axios";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {useApi} from "../../../hooks/useApi";
import { useAuth0 } from "@auth0/auth0-react";

function NewProject() {
	const [newProjectName, setProjectName] = React.useState("");
	const [newProjectDescription, setProjectDescription] = React.useState("");
	const [newProjectWebsite, setNewProjectWebsite] = React.useState("");
	const [tags, setTags] = React.useState([]);
	const [tagInput, setTagInput] = React.useState("");
	const [privateProject, setPrivate] = React.useState(false);
	// const [newLicence, setLicence] = React.useState("");
	// const [initREADME, setInitREADME] = React.useState(false);
	// Conditional state
	const [radioChecked, setRadioChecked] = React.useState(false);
	const [redirect, setRedirect] = React.useState(false);

	// validation
	const [validName, setValidName] = React.useState(false);
	const [nameValidStatus, setNameValidStatus] = React.useState("");
	const [nameHelpText, setNameHelpText] = React.useState("");

	// Import sub components from antd
	const { TextArea } = Input;
	const { Content } = Layout;
	const { Paragraph } = Typography;

	const {get, post} = useApi();
	const { user, isAuthenticated, isLoading } = useAuth0();

	const dispatch = useDispatch();

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
			path: "/profile",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/projects",
			breadcrumbName: "Your Projects",
		},
		{
			path: "/new",
			breadcrumbName: "Create new project",
		},
	];

	const handleInputChange = (input, value) => {
		switch (input) {
			case 0:
				setProjectName(value);
				break;

			case 1:
				setProjectDescription(value);
				break;

			case 2:
				setNewProjectWebsite(value);
				break;

			case 3:
				setTagInput(value);
				break;

			// case 4:
			// 	setLicence(value);
			// 	break;

			// case 5:
			// 	setInitREADME(value);
			// 	break;

			default:
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (user.email_verified) {
			post(`/projects`, {
				name: newProjectName,
				description: newProjectDescription,
				website: newProjectWebsite,
				tags: tags,
				isPrivate: privateProject,
				// TODO Uncomment this when we have implemented the functionality for it
				/* license: newLicence,
                initializeREADME: initREADME */
			}).then(function () {
				dispatch(
					createAlert(
						"Project Created",
						"Project has successfully been created. You can now add modules to the project.",
						"success",
						true
					)
				);
				setRedirect(true);
			}).catch(() => {
				dispatch(
					createAlert(
						"Failed to create project",
						"Failed to create the given project, try again later. If it doesn't work make an issue on GitHub.",
						"error",
						true
					)
				);
			});
		} else {
			dispatch(
				createAlert(
					"Project Creation failed",
					"You can't create a project without verifying your account. Please check your email inbox for a verification email, and follow the instructions.",
					"warning",
					true
				)
			);
		}
	};

	const validateName = (value) => {
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
			setNameHelpText("Only letters, numbers and dashes are allowed. Spaces and special characters not allowed");
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
				title="Create New Project"
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
			>
				<Paragraph>Fill in the form below to create a new project</Paragraph>
			</PageHeader>
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
					minHeight: 280,
				}}
			>
				{redirect ? <Navigate to="/profile/projects" /> : <div />}
				<Form {...formItemLayout}>
					<Form.Item
						name="projectName"
						label="Project Name"
						hasFeedback
						validateStatus={nameValidStatus}
						help={nameHelpText}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input onChange={(event) => validateName(event.target.value)} />
					</Form.Item>

					<Form.Item label="Project Description" style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}>
						<TextArea id="project-description" onChange={(event) => handleInputChange(1, event.target.value)} />
					</Form.Item>
					<Form.Item
						label={
							<span>
								Website&nbsp;
								<Tooltip title="You can link a website affiliated with your project. This can be GitHub link, hosted website link etc.">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					>
						<Input onChange={(event) => handleInputChange(2, event.target.value)} />
					</Form.Item>
					<Form.Item
						label={
							<span>
								Tags&nbsp;
								<Tooltip title="Tags can be used to identify and search for projects">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					>
						<Input
							placeholder='Press "ENTER" to add tag'
							id="project-tags"
							value={tagInput}
							onChange={(event) => handleInputChange(3, event.target.value)}
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
					<Form.Item
						name="privateProject"
						label={
							<span>
								Private project&nbsp;
								<Tooltip title="Private means only you can access. Public means everyone can access (currently only public projects available)">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
						rules={[
							{
								required: true,
							},
						]}
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
					>
						<Radio.Group value="no">
							<Radio
								disabled
								value="yes"
								onChange={() => {
									setRadioChecked(true);
									setPrivate(true);
								}}
							>
								Yes
							</Radio>
							<Radio
								value="no"
								onChange={() => {
									setRadioChecked(true);
									setPrivate(false);
								}}
							>
								No
							</Radio>
						</Radio.Group>
					</Form.Item>
					{/* TODO When we have support for this part, uncomment */}
					{/* <Form.Item>
                        <Checkbox   style={{textAlign: "left", display:"block"}}
                                    justify="left" 
                                    onChange={event => handleInputChange(5, event.target.checked)}
                                    >Initialize with README</Checkbox>
                    </Form.Item>
                    <Form.Item>
                    <Select value={newLicence}
                            placeholder="Licence"
                            style={{width: 50}}
                            value={newLicence}
							onChange={value => handleInputChange(4, value)}>
                        <Option value="Be">Org1</Option>
                        <Option value="nd">Org2</Option>
                        <Option value="ik">Org3</Option>
                    </Select>
                    </Form.Item> */}

					<div style={{ width: "100%", textAlign: "center" }} onClick={(e) => handleSubmit(e)}>
						<Button id="create-project-btn" disabled={!validName} type="primary">
							Create Project
						</Button>
					</div>
				</Form>
			</Content>
		</div>
	);
}

export default NewProject;
