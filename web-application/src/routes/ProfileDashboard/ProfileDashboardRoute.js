import { Layout, Menu, Button } from "antd";
import { HddOutlined, FolderOutlined, ApartmentOutlined, DesktopOutlined } from "@ant-design/icons";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Redirect } from "react-router-dom";
import Identicon from "../../assets/image/download.png";
import ProfileAlert from "../../components/CustomAlerts/ProfileAlert";
import Navbar from "../../components/Navbar/Navbar";
import { useKeycloak } from "@react-keycloak/web";
import { createAlert } from "../../store/actions/generalActions";
import axios from "axios";
// Import custom components
import { selectMenuOption } from "../../store/actions/generalActions";
// Import styles
import "./ProfileDashboardStyle.scss";

/**
 * The default layout for a profile dashboard route
 */
function ProfileDashboardLayout({ children }) {
	const [collapsed, setCollapsed] = React.useState(false);

	const [keycloak] = useKeycloak();

	// Get antd sub components
	const { Sider, Content } = Layout;

	// TODO - refactor - code duplicate in OrganizationDashboardRoute
	// Get state from redux store
	const selectedMenuItem = useSelector((state) => state.general.selectedMenuOption);
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
		console.log(keycloak.realmAccess.roles);
		if (keycloak.idTokenParsed.email_verified === false) {
			dispatch(createAlert("Please verify your email address", text, "warning", true));
		}
	}, []);

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
						onClick={(e) => dispatch(selectMenuOption(e.key))}
						style={{ height: "100%", borderRight: 0 }}
					>
						<div style={{ textAlign: "center" }}>
							<img className="identicon" src={Identicon} alt="identicon" />
						</div>
						<Menu.Item key="1">
							<Link to="/profile/projects" id="sidebar-projects-link">
								<FolderOutlined />
								{collapsed ? <div /> : "Your Projects"}
							</Link>
						</Menu.Item>
						<Menu.Item key="2">
							<Link to="/profile/servers" id="sidebar-servers-link">
								<HddOutlined />
								{collapsed ? <div /> : "Your Servers"}
							</Link>
						</Menu.Item>
						<Menu.Item key="3">
							<Link to="/profile/organizations" id="sidebar-organization-link">
								<ApartmentOutlined />
								{collapsed ? <div /> : "Your Organizations"}
							</Link>
						</Menu.Item>
						{keycloak.realmAccess.roles.includes("ADMIN") ? (
							<Menu.Item key="9">
								<Link to="/monitor" id="sidebar-monitor-link">
									<DesktopOutlined />
									{collapsed ? <div /> : "Monitor"}
								</Link>
							</Menu.Item>
						) : null}
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

// TODO Move the onAccountVerification part to the layout instead of route,
// Need to find out how to use connect on two different without exporting both.
/**
 * The route itself that is used for the profile dashboard related routes
 */
function ProfileDashboardRoute({ component: Component, ...rest }) {
	const [keycloak] = useKeycloak();
	return (
		<Route
			{...rest}
			render={(props) =>
				keycloak.authenticated === true ? (
					<ProfileDashboardLayout>
						<Suspense fallback={<div />}>
							<Component {...props} />
						</Suspense>
					</ProfileDashboardLayout>
				) : (
					<Redirect to={"/"} />
				)
			}
		/>
	);
}

export default ProfileDashboardRoute;
