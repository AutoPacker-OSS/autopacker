import {
	Avatar,
	Button,
	Card,
	Checkbox,
	Col,
	Empty,
	Layout,
	Modal,
	PageHeader,
	Row,
	Typography,
	Spin,
	Input,
	Form,
} from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

import { createAlert } from "../../../store/actions/generalActions";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import {
	GlobalOutlined,
	PlusCircleOutlined,
	SettingOutlined,
	CaretRightOutlined,
	DeleteOutlined,
	GitlabOutlined,
	FolderOutlined,
} from "@ant-design/icons";

function ServerOverview() {
	// State
	const [server, setServer] = React.useState({});
	const [modalOpen, setModalOpen] = React.useState(false);
	const [selectedCard, setSelectedCard] = React.useState(null);
	const [refreshList, setRefreshList] = React.useState(false);
	const [deployingProjects, setDeployingProjects] = React.useState([]);
	const [deployFinished, setDeployFinished] = React.useState(false);
	const [serverPassword, setServerPassword] = React.useState("");

	// Project Deletion
	const [projectToDeleteSelected, setProjectToDeleteSelected] = React.useState(null);
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

	// Installation things
	const [installationModalOpen, setInstallationModalOpen] = React.useState(false);
	const [installationLoading, setInstallationLoading] = React.useState(false);

	// Deploy project modal
	const [deployProjectModalOpen, setDeployProjectModalOpen] = React.useState(false);
	const [projectToDeploy, setProjectToDeploy] = React.useState(null);

	// State for project management
	const [serverProjects, setServerProjects] = React.useState(null);
	const [userProjects, setUserProjects] = React.useState([]);
	const [projectModalOpen, setProjectModalOpen] = React.useState(false);
	const [numbSelected, setNumbSelected] = React.useState(0);
	const [checkedProjects, setCheckedProjects] = React.useState([]);

	const [keycloak] = useKeycloak();

	const dispatch = useDispatch();

	// Get antd sub components
	const { Paragraph, Text } = Typography;
	const { Content } = Layout;
	const { Meta } = Card;

	useEffect(() => {
		setSelectedCard(null);

		let serverId = sessionStorage.getItem("selectedServer");

		axios({
			method: "get",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_SERVER_MANAGER +
				"/server/server-overview/" +
				serverId,
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		}).then(function (response) {
			setServer(response.data);
			// TODO iff response contains some projects, fetch them from file system api
			if (response.data.projectIds !== "") {
				let list = [];
				axios({
					method: "get",
					url:
						process.env.REACT_APP_APPLICATION_URL +
						process.env.REACT_APP_FILE_DELIVERY_API +
						"/projects",
					headers: {
						Authorization:
							keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
					},
				}).then((resp) => {
					setUserProjects(resp.data);

					let listContainingServerProjectsAndLoadingState = [];

					resp.data.forEach((project) => {
						response.data.projectIds.split(",").forEach((projectId) => {
							// eslint-disable-next-line eqeqeq
							if (projectId == project.id) {
								list.push(project);
								listContainingServerProjectsAndLoadingState.push({
									id: project.id,
									loading: false,
								});
							}
						});
					});
					if (list.length <= 0) {
						setServerProjects(null);
						setDeployingProjects(null);
					} else {
						setServerProjects(list);
						setDeployingProjects(listContainingServerProjectsAndLoadingState);
					}
				});
			}
		});

		// TODO Might want to take this last part into own method as it might not be relevant for the user all the time
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
			setUserProjects(response.data);
			let list = [];
			response.data.forEach((project) => {
				list.push({ id: project.id, checked: false });
			});
			setCheckedProjects(list);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshList]);

	const updateServerProjects = (projectIds) => {
		axios({
			method: "post",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_SERVER_MANAGER +
				"/server/add-project",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			data: {
				server_id: server.serverId,
				project_ids: projectIds,
			},
		})
			.then(() => {
				window.location.reload();
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Project not added",
						"Couldn't add the project(s) to the server",
						"error",
						true
					)
				);
			});
	};

	const toggleCheckedProject = (projectId) => {
		let numbCheckedProjects = 0;
		checkedProjects.forEach((project) => {
			if (project.id === projectId) {
				project.checked = !project.checked;
			}
			if (project.checked) {
				numbCheckedProjects++;
			}
		});
		setNumbSelected(numbCheckedProjects);
	};

	const toggleLoadingState = (projectId) => {
		let projectsLoading = deployingProjects;
		projectsLoading.forEach((project) => {
			if (project.id === projectId) {
				projectsLoading[projectsLoading.indexOf(project)].loading = !projectsLoading[
					projectsLoading.indexOf(project)
					].loading;
			}
		});
		setDeployingProjects(projectsLoading);
	};

	const getLoadingStateForProject = (projectId) => {
		let loading = false;
		deployingProjects.forEach((project) => {
			if (project.id === projectId) {
				loading = project.loading;
			}
		});
		return loading;
	};

	const getProjectCheckedValue = (projectId) => {
		let checked = false;
		checkedProjects.forEach((project) => {
			if (project.id === projectId) {
				checked = project.checked;
			}
		});
		return checked;
	};

	function deployProject() {
		setDeployFinished(false);
		toggleLoadingState(projectToDeploy.projectId);
		setDeployProjectModalOpen(false);

		axios({
			method: "post",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_SERVER_MANAGER +
				"/server/deployProject/",
			data: {
				serverId: server.serverId,
				projectName: projectToDeploy.projectName,
				password: serverPassword,
			},
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		})
			.then(function (response) {
				setDeployFinished(true);
				dispatch(
					createAlert(
						"Project successfully deployed",
						"You can view your project at this address: " + server.ip,
						"success",
						true
					)
				);
				toggleLoadingState(projectToDeploy.projectId);
				setServerPassword("");
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Failed to deploy project",
						"Something went wrong while deploying the project. Submit a issue on GitHub for assistance.",
						"error",
						true
					)
				);
				setServerPassword("");
			});
	};

	const installEssentials = () => {
		setInstallationModalOpen(false);
		setInstallationLoading(true);

		axios({
			method: "post",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_SERVER_MANAGER +
				"/server/init/",
			data: {
				serverId: server.serverId,
				password: serverPassword,
			},
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
		})
			.then(function (response) {
				dispatch(
					createAlert(
						"Successfully installed essentials",
						"We have disabled the firewall and installed docker and docker-compose.",
						"success",
						true
					)
				);
				setInstallationLoading(false);
				setServerPassword("");
			})
			.catch((error) => {
				dispatch(
					createAlert(
						"Failed to install essentials",
						"Something went wrong while installing server essential software.",
						"error",
						true
					)
				);
				setInstallationLoading(false);
				setServerPassword("");
			});
	};

	const routes = [
		{
			path: "/profile",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/servers",
			breadcrumbName: "Your Servers",
		},
		{
			path: "/overview",
			breadcrumbName: server.title,
		},
	];

	const title = (
		<div>
			{server.title}
			<GlobalOutlined style={{ marginLeft: 20 }} />
			{server.open ? " Public" : " Private"}
		</div>
	);

	let actions = "Actions: Unavailable";
	let statusColor = "blue";
	// switch (server.status) {
	// 	case "on":
	// 		statusColor = "green";
	// 		actions = (
	// 			<p>
	// 				Actions: <span style={{ color: "blue" }}>Stop - Restart</span>
	// 			</p>
	// 		);
	// 		break;

	// 	case "off":
	// 		statusColor = "red";
	// 		actions = (
	// 			<p>
	// 				Actions: <span style={{ color: "blue" }}>Start</span>
	// 			</p>
	// 		);
	// 		break;

	// 	case "restart":
	// 		statusColor = "blue";
	// 		actions = (
	// 			<p>
	// 				Actions: <span style={{ color: "blue" }}>Stop - Restart</span>
	// 			</p>
	// 		);
	// 		break;

	// 	default:
	// 		statusColor = "#fcd700";
	// 		actions = "Actions: Unavailable";
	// 		break;
	// }

	const handleProjectSubmit = () => {
		let projectIds = "";
		checkedProjects.forEach((project) => {
			if (project.checked) {
				if (projectIds === "") {
					projectIds += project.id;
				} else {
					projectIds += "," + project.id;
				}
			}
		});
		updateServerProjects(projectIds);
		setProjectModalOpen(false);
	};

	const selectModalToDelete = (id, name) => {
		setProjectToDeleteSelected({
			id: id,
			name: name,
		});
		setDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
		setProjectToDeleteSelected(null);
	};

	const deleteModal = () => {
		axios({
			method: "post",
			url:
				process.env.REACT_APP_APPLICATION_URL +
				process.env.REACT_APP_SERVER_MANAGER +
				"/server/remove-project",
			headers: {
				Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
			},
			data: {
				server_id: server.serverId,
				project_id: projectToDeleteSelected.id,
				project_name: projectToDeleteSelected.name,
				password: serverPassword,
			},
		})
			.then(() => {
				/* dispatch(
					createAlert(
						"Project successfully deleted",
						"You have successfully deleted the project: " +
							projectToDeleteSelected.name,
						"success",
						true
					)
				); */
				closeDeleteModal();
				setServerPassword("");
				window.location.reload();
			})
			.catch(() => {
				dispatch(
					createAlert(
						"Failed to delete project",
						"Failed to delete the project: " +
						projectToDeleteSelected.name +
						". Please write an issue on GitHub if this is unresolved",
						"error",
						true
					)
				);
				closeDeleteModal();
				setServerPassword("");
			});
	};

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
					paddingBottom: 50,
				}}
				title={title}
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
				extra={[
					<Button
						key={0}
						type="link"
						style={{ marginLeft: 10, marginRight: 10 }}
						onClick={() => setProjectModalOpen(true)}
					>
						<PlusCircleOutlined /> Add Project
					</Button>,
					<Link
						id="server-settings-link"
						key={1}
						style={{ marginLeft: 10, marginRight: 10 }}
						to={"/profile/servers/overview/" + server.title + "/settings"}
					>
						<SettingOutlined /> Settings
					</Link>,
				]}
			>
				{server.description !== null ? (
					<Paragraph>{server.description}</Paragraph>
				) : (
					<div />
				)}

				{/* // TODO Maybe implement website (for example domain of project) later */}
				{/* <Paragraph style={{ color: "blue" }}>
					{server.website !== "" ? (
						<a href={server.website} rel="noopener noreferrer" target="_blank">
							<Icon type="global" /> {server.website}
						</a>
					) : (
						<div />
					)}
				</Paragraph> */}
				<div>
					<Paragraph style={{ color: statusColor }}>
						Status: Unavailable{/*server.status*/}
					</Paragraph>
					<Paragraph>
						Username: {server.serverUsername} -{" "}
						{/*Default Password: {server.password} - */}
						IP Address: {server.ip}
					</Paragraph>

					<div>
						<Paragraph style={{ float: "left" }}>{actions}</Paragraph>

						<Button
							onClick={() => setInstallationModalOpen(true)}
							disabled={installationLoading}
							style={{ float: "right" }}
						>
							<Spin spinning={installationLoading}>Install Essentials</Spin>
						</Button>
					</div>
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
				{serverProjects !== null ? (
					<Row gutter={[24, 24]}>
						{serverProjects.map((project) => (
							<Col xs={24} lg={8} xl={6} key={serverProjects.indexOf(project)}>
								<Spin
									spinning={
										getLoadingStateForProject(project.id) && !deployFinished
									}
								>
									<Card
										onClick={() => setSelectedCard(project)}
										hoverable
										style={{ width: 240 }}
										bodyStyle={{ padding: 0 }}
										actions={[
											<CaretRightOutlined
												style={{ fontSize: 20 }}
												key="upload"
												onClick={() => {
													setProjectToDeploy({
														projectId: project.id,
														projectName: project.name,
													});
													setDeployProjectModalOpen(true);
												}}
											/>,
											<DeleteOutlined
												key="delete"
												onClick={() =>
													selectModalToDelete(
														project.id,
														project.name
													)
												}
											/>,
										]}
									>
										<div onClick={() => setModalOpen(true)}>
											<img
												style={{ width: "100%" }}
												alt="Project"
												src={
													"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
												}
											/>
											<Meta
												style={{ padding: 20 }}
												title={project.name}
												description={
													<Paragraph ellipsis>{project.description}</Paragraph>
												}
											/>
										</div>
									</Card>
								</Spin>
							</Col>
						))}
					</Row>
				) : (
					<Empty
						imageStyle={{
							height: 150,
						}}
						description="Server contains no projects"
					>
						<Button type="primary" onClick={() => setProjectModalOpen(true)}>
							Add Project(s)
						</Button>
					</Empty>
				)}
				{selectedCard !== null ? (
					<Modal
						title={selectedCard.name}
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
							alt="Project"
							src={
								"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
							}
						/>
						<p style={{ marginTop: 20 }}>{module.desc}</p>
						<Paragraph>{selectedCard.desc}</Paragraph>
						<Paragraph>
							{selectedCard.website !== "" ? (
								<a
									href={selectedCard.website}
									target="_blank"
									rel="noopener noreferrer"
								>
									<GitlabOutlined /> {selectedCard.website}
								</a>
							) : (
								<div />
							)}
						</Paragraph>
					</Modal>
				) : (
					<div />
				)}

				<Modal
					title="Add existing project(s) to server"
					centered
					visible={projectModalOpen}
					onOk={() => handleProjectSubmit()}
					onCancel={() => setProjectModalOpen(false)}
				>
					<Paragraph>
						{numbSelected} selected of {userProjects.length} available
					</Paragraph>

					{serverProjects === null
						? userProjects.map((project) => (
							<Card
								key={project.id}
								hoverable
								style={{ height: "auto", marginBottom: 10 }}
								size="small"
								onClick={() => toggleCheckedProject(project.id)}
							>
								<div>
									<Avatar
										size="large"
										icon={<FolderOutlined />}
										style={{
											float: "left",
											verticalAlign: "middle",
										}}
									></Avatar>
									<div style={{ verticalAlign: "middle" }}>
										<Text style={{ marginLeft: 16 }}>
											{project.name}
										</Text>
										<Checkbox
											checked={getProjectCheckedValue(project.id)}
											style={{ float: "right" }}
										/>
									</div>
								</div>
							</Card>
						))
						: userProjects.map((project) =>
							serverProjects.includes(project) ? (
								<Card
									key={project.id}
									style={{
										height: "auto",
										marginBottom: 10,
										backgroundColor: "#b5b5b5",
									}}
									size="small"
								>
									<div>
										<Avatar
											size="large"
											icon={<FolderOutlined />}
											style={{
												float: "left",
												verticalAlign: "middle",
											}}
										></Avatar>
										<div style={{ verticalAlign: "middle" }}>
											<Text style={{ marginLeft: 16 }}>
												{project.name}
											</Text>
											<Checkbox
												checked={true}
												style={{ float: "right" }}
											/>
										</div>
									</div>
								</Card>
							) : (
								<Card
									key={project.id}
									hoverable
									style={{ height: "auto", marginBottom: 10 }}
									size="small"
									onClick={() => toggleCheckedProject(project.id)}
								>
									<div>
										<Avatar
											size="large"
											icon={<FolderOutlined />}
											style={{
												float: "left",
												verticalAlign: "middle",
											}}
										></Avatar>
										<div style={{ verticalAlign: "middle" }}>
											<Text style={{ marginLeft: 16 }}>
												{project.name}
											</Text>
											<Checkbox
												checked={getProjectCheckedValue(project.id)}
												style={{ float: "right" }}
											/>
										</div>
									</div>
								</Card>
							)
						)}
				</Modal>
				{/* Delete Modal */}
				{projectToDeleteSelected !== null ? (
					<Modal
						title={'Delete "' + projectToDeleteSelected.name + '"?'}
						centered
						visible={deleteModalOpen}
						onOk={() => deleteModal()}
						okButtonProps={{ disabled: serverPassword.length > 0 ? false : true }}
						okText="Yes"
						okType="danger"
						onCancel={() => closeDeleteModal()}
					>
						<Paragraph>Are you sure you want to delete this project?</Paragraph>
						<Form layout="vertical">
							<Form.Item
								name="password"
								label="Enter server password to confirm deletion"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
								]}
							>
								<Input.Password
									onChange={(e) => setServerPassword(e.target.value)}
								/>
							</Form.Item>
						</Form>
					</Modal>
				) : (
					<div />
				)}
				{/* Installation Modal */}
				{installationModalOpen ? (
					<Modal
						title={"Install Essentials?"}
						centered
						visible={installationModalOpen}
						onOk={() => installEssentials()}
						okButtonProps={{ disabled: serverPassword.length > 0 ? false : true }}
						okText="Yes"
						onCancel={() => setInstallationModalOpen(false)}
					>
						<Paragraph>
							This will disable the server firewall, and download docker and
							docker-compose. These are needed to be able to run projects on the
							server.
						</Paragraph>
						<Form layout="vertical">
							<Form.Item
								name="password"
								label="Enter server password to install essentials"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
								]}
							>
								<Input.Password
									onChange={(e) => setServerPassword(e.target.value)}
								/>
							</Form.Item>
						</Form>
					</Modal>
				) : (
					<div />
				)}
				{/* Deploy project modal */}
				{deployProjectModalOpen ? (
					<Modal
						title={"Deploy project?"}
						centered
						visible={deployProjectModalOpen}
						onOk={() => {deployProject()}}
						okButtonProps={{ disabled: serverPassword.length <= 0 }}
						okText="Yes"
						onCancel={() => setDeployProjectModalOpen(false)}
					>
						<Paragraph>
							Fill in your server password to connect to server and click ok to deploy
							project
						</Paragraph>
						<Form layout="vertical">
							<Form.Item
								name="password"
								label="Enter server password to deploy the project"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
								]}
							>
								<Input.Password
									onChange={(e) => setServerPassword(e.target.value)}
								/>
							</Form.Item>
						</Form>
					</Modal>
				) : (
					<div />
				)}
			</Content>
		</div>
	);
}

export default ServerOverview;
