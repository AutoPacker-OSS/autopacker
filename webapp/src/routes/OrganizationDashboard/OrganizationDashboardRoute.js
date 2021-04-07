import { Layout, Menu, Button } from "antd";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, NavLink, Redirect, Route} from "react-router-dom";
import NTNU from "../../assets/image/ntnu.png";
import ProfileAlert from "../../components/CustomAlerts/ProfileAlert";
import Navbar from "../../components/Navbar/Navbar";
import { useKeycloak } from "@react-keycloak/web";
import { createAlert } from "../../store/actions/generalActions";
import { getMenu } from "./menu";
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
						process.env.REACT_APP_API +
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
							openKeys={openedSubMenus}
							// Called when a menu item is clicked
							style={{ height: "100%", borderRight: 0 }}
						>
							<div style={{ textAlign: "center" }}>
								{/* // TODO Need to change NTNU to use image of organization later on */}
								<img style={{ backgroundColor: "white" }} className="identicon" src={NTNU} alt="identicon" />
							</div>

							{/* Menu */}
							{getMenu(organizationName).map(menuItem => (
								<SubMenu
									onTitleClick={() => dispatch(toggleSubMenuOption(menuItem.key))}
									key={menuItem.key}
									title={
										<span>
											{menuItem.icon}
											{collapsed ? null : menuItem.text}
										</span>
									}
								>
									{/* Submenu items */}
									{menuItem.items !== null ? (
										menuItem.items.map(childItem => {
											if (childItem.role !== null) {
												return keycloak.realmAccess.roles.includes("ADMIN") ? (
													<NavLink key={childItem.key} activeClassName="ant-menu-item-selected" to={childItem.to} className="ant-menu-item ant-menu-item-only-child" style={{paddingLeft: 48}}>
														{childItem.text}
													</NavLink>
												) : null;
											} else {
												return (
													<NavLink key={childItem.key} activeClassName="ant-menu-item-selected" to={childItem.to} className="ant-menu-item ant-menu-item-only-child" style={{paddingLeft: 48}}>
														{childItem.text}
													</NavLink>
												);
											}
										})
									) : null}
								</SubMenu>
							))}
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
