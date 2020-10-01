import { Button, Form, Input, Layout, Radio, Tag, Tooltip } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAlert } from "../../../../../store/actions/generalActions";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

//import AuthorInput from "./components/AuthorInput";
//import LinkInput from "./components/LinkInput";
import { QuestionCircleOutlined } from "@ant-design/icons";

function RequestEditForm(props) {
	// Form state
	const [projectName, setProjectName] = React.useState("");
	const [desc, setDesc] = React.useState("");
	const [type, setType] = React.useState("");
	const [authors, setAuthors] = React.useState([]);
	const [links, setLinks] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	const [comment, setComment] = React.useState("");

	// Controller state
	const [tagInput, setTagInput] = React.useState("");

	// validation
	const [validName, setValidName] = React.useState(true);
	const [nameValidStatus, setNameValidStatus] = React.useState("");
	const [nameHelpText, setNameHelpText] = React.useState("");

	// Import sub components from antd
	const { TextArea } = Input;
	const { Content } = Layout;

	const { request, setOpenEditModal, toggleRefresh } = props;

	const [keycloak] = useKeycloak();

	const organizationName = sessionStorage.getItem("selectedOrganizationName");
	const dispatch = useDispatch();

	useEffect(() => {
		setProjectName(request.organizationProject.name);
		setDesc(request.organizationProject.description);
		setType(request.organizationProject.type);
		setAuthors(request.organizationProject.authors.split(", "));
		setLinks(request.organizationProject.links.split(", "));
		setTags(request.organizationProject.tags.split(","));
		setComment(request.comment);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

		axios({
			method: "post",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_GENERAL_API +
				"/organization/updateProjectSubmission",
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
				comment: comment,
				projectId: request.organizationProject.id,
			},
		})
			.then(() => {
				dispatch(
					createAlert(
						"Project request updated",
						"You have successfully updated the project information. You will receive a notification on email when the request has been handled.",
						"success",
						true
					)
				);
				toggleRefresh();
				setOpenEditModal(false);
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Project request update failed",
						"Something went wrong while trying to update the project. Contact organization admin.",
						"error",
						true
					)
				);
				toggleRefresh();
				setOpenEditModal(false);
			});
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
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
					minHeight: 280,
				}}
			>
				{/* TODO Change active component to be data display instead of form after submitting change */}

				<Form {...formItemLayout}>
					{/* Project Name */}
					<Form.Item
						hasFeedback
						validateStatus={nameValidStatus}
						help={nameHelpText}
						label="Project Name"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input
							defaultValue={request.organizationProject.name}
							onChange={(event) => validateName(event.target.value)}
						/>
					</Form.Item>
					{/* Project Description */}
					<Form.Item
						label="Project Description"
						style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
					>
						<TextArea
							defaultValue={request.organizationProject.description}
							onChange={(e) => setDesc(e.target.value)}
						/>
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
							defaultValue={request.organizationProject.type}
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
					{/* <AuthorInput authors={request.organizationProject.authors.split(", ")} updateAuthors={setAuthors} /> */}
					{/* Link(s) Section */}
					{/* <LinkInput links={request.organizationProject.links.split(", ")} updateLinks={setLinks} /> */}
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
						<TextArea
							defaultValue={request.comment}
							onChange={(event) => setComment(event.target.value)}
						/>
					</Form.Item>
					{/* Button Section */}
					<div style={{ width: "100%", textAlign: "center" }}>
						<Button style={{ marginRight: 10 }} onClick={() => setOpenEditModal(false)}>
							Cancel Edit
						</Button>
						<Button
							disabled={!validName}
							type="primary"
							onClick={(e) => handleSubmit(e)}
						>
							Submit Changes
						</Button>
					</div>
				</Form>
			</Content>
		</div>
	);
}

export default RequestEditForm;
