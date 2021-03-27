import { Layout, Menu, Button } from "antd";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, Route } from "react-router-dom";
import NTNU from "../../assets/image/ntnu.png";
import ProfileAlert from "../../components/CustomAlerts/ProfileAlert";
import Navbar from "../../components/Navbar/Navbar";
import { useKeycloak } from "@react-keycloak/web";
import { createAlert } from "../../store/actions/generalActions";
import axios from "axios";
// Import custom components
import { selectMenuOption, toggleSubMenuOption } from "../../store/actions/generalActions";
// Import styles
import "../ProfileDashboard/ProfileDashboardStyle.scss";
import { FolderOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

/**
 * The default layout for a organization dashboard route
 */
function OrganizationDashboardLayout({ children }) {
	// State
	const [collapsed, setCollapsed] = React.useState(false);
	// Get antd sub components
	const { Sider, Content } = Layout;
	const { SubMenu } = Menu;

	const [keycloak] = useKeycloak();

	// Get state from redux store
	const organizationName = sessionStorage.getItem("selectedOrganizationName");
	const selectedMenuItem = useSelector((state) => state.general.selectedMenuOption);
	const openedSubMenus = useSelector((state) => state.general.openedSubMenus);
	const dispatch = useDispatch();

	const text = (
		<div>
			To be able to create, deploy and share projects, you need to verify your account. Didn't get the email?{" "}
			<Button
				style={{ padding: 0 }}
				type="link"
				onClick={() => {
					const url =
						process.env.REACT_APP_APPLICATION_URL +
						process.env.REACT_APP_AUTHENTICATION_SERVER +
						"/auth/resendVerificationToken";

					axios
						.get(url)
						.then(() => {
							dispatch(
								createAlert(
									"New verification token sent",
									"Successfully sent a new verification token. Please check your inbox for a new verification email.",
									"success",
									true
								)
							);
						})
						.catch(() => {
							dispatch(
								createAlert(
									"Request failed",
									"Could not request a new verification token. Try again later or contact support here: contact@autopacker.no",
									"error",
									true
								)
							);
						});
				}}
			>
				Click here to resend
			</Button>
		</div>
	);

	React.useEffect(() => {
		if (keycloak.idTokenParsed.email_verified === false) {
			dispatch(createAlert("Please verify your email address", text, "warning", true));
		}
	}, []);

	if (organizationName == null) {
		return <Redirect to="/profile/organizations" />;
	} else {
		return (
			<Layout>
				{/* Navbar */}
				<Navbar />
				{/* Content */}
				<Layout style={{ minHeight: "95vh" }}>
					<Sider
						width={200}
						style={{ background: "#fff", padding: 0 }}
						collapsible
						collapsed={collapsed}
						onCollapse={() => setCollapsed(!collapsed)}
					>
						<Menu
							theme="dark"
							mode="inline"
							selectedKeys={[selectedMenuItem]}
							openKeys={openedSubMenus}
							// Called when a menu item is clicked
							onClick={(e) => dispatch(selectMenuOption(e.key))}
							// Called when sub-menus are opened or closed
							//onOpenChange={e => dispatch(toggleSubMenuOption(e[0]))}
							// onTitleClick={e => dispatch(toggleSubMenuOption(e.key))}
							style={{ height: "100%", borderRight: 0 }}
						>
							<div style={{ textAlign: "center" }}>
								{/* // TODO Need to change NTNU to use image of organization later on */}
								<img style={{ backgroundColor: "white" }} className="identicon" src={NTNU} alt="identicon" />
							</div>
							<SubMenu
								onTitleClick={(e) => dispatch(toggleSubMenuOption(e.key))}
								key="sub1"
								title={
									<span>
										<FolderOutlined />
										{collapsed ? <div /> : "Projects"}
									</span>
								}
							>
								<Menu.Item key="4">
									<Link to={"/organization/dashboard/" + organizationName}>Overview</Link>
								</Menu.Item>
								{keycloak.tokenParsed.resource_access["general-api"].roles.includes("ADMIN") ? (
									<Menu.Item key="5">
										<Link to={"/organization/project-requests/" + organizationName}>Project Requests</Link>
									</Menu.Item>
								) : (
									<div />
								)}
							</SubMenu>
							<SubMenu
								onTitleClick={(e) => dispatch(toggleSubMenuOption(e.key))}
								key="sub2"
								title={
									<span>
										<TeamOutlined />
										{collapsed ? <div /> : "Members"}
									</span>
								}
							>
								<Menu.Item key="6">
									<Link to={"/organization/members/" + organizationName}>Overview</Link>
								</Menu.Item>
								{keycloak.tokenParsed.resource_access["general-api"].roles.includes("ADMIN") ? (
									<Menu.Item key="7">
										<Link to={"/organization/applicants/" + organizationName}>Applicants</Link>
									</Menu.Item>
								) : (
									<div />
								)}
								{keycloak.tokenParsed.resource_access["general-api"].roles.includes("ADMIN") ? (
									<Menu.Item key="10">
										<Link to={"/organization/rolecontrol/" + organizationName}>Role Control</Link>
									</Menu.Item>
								) : (
									<div />
								)}
							</SubMenu>
							<SubMenu
								onTitleClick={(e) => dispatch(toggleSubMenuOption(e.key))}
								key="sub3"
								title={
									<span>
										<UserOutlined />
										{collapsed ? <div /> : "Personal"}
									</span>
								}
							>
								<Menu.Item key="8">
									<Link to={"/organization/create-project/" + organizationName}>Create Project</Link>
								</Menu.Item>
								<Menu.Item key="9">
									<Link to={"/organization/submissions/" + organizationName}>Submissions</Link>
								</Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<Content>
						<ProfileAlert />
						{children}
					</Content>
				</Layout>
			</Layout>
		);
	}
}

/**
 * The route itself that is used for the profile dashboard related routes
 */
function OrganizationDashboardRoute({ component: Component, ...rest }) {
	const [keycloak] = useKeycloak();
	return (
		<Route
			{...rest}
			render={(props) =>
				keycloak.authenticated === true ? (
					<OrganizationDashboardLayout>
						<Suspense fallback={<div />}>
							<Component {...props} />
						</Suspense>
					</OrganizationDashboardLayout>
				) : (
					<Redirect to={"/"} />
				)
			}
		/>
	);
}

export default OrganizationDashboardRoute;
