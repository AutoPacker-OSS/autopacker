import {Avatar, Input, Layout, Menu, Typography} from "antd";
import React, {useContext, useEffect} from "react";
import {Link, Navigate} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// Import styles
import "./NavbarStyle.scss";
import {ApartmentOutlined, FolderOutlined, HddOutlined, LogoutOutlined, SettingOutlined,} from "@ant-design/icons";

/**
 * Represents the navigation bar at the top of the homepage
 */
function Navbar() {
	// state
	const [search, setSearch] = React.useState("");
	const [searchAction, setSearchAction] = React.useState(false);

	// Okta hook
	const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

	// Get antd sub components
	const {Header} = Layout;
	const {SubMenu} = Menu;
	const {Search} = Input;

	useEffect(() => {
		setSearchAction(false);
	}, [searchAction]);

	return (
		<Header className="header">
			{isAuthenticated ? (
				<Link to="/profile/projects" id="main-dashboard-link">
					<b style={{fontSize: 16, float: "left"}}>AutoPacker</b>
				</Link>
			) : (
				<Link to="/">
					<b style={{fontSize: 16, float: "left"}}>AutoPacker</b>
				</Link>
			)}
			<div style={{lineHeight: "64px", float: "left", marginRight: 20, marginLeft: 20}}>
				<Search
					placeholder="Search users, projects ..."
					onChange={(e) => setSearch(e.target.value)}
					onSearch={() => setSearchAction(true)}
					style={{width: 200, paddingTop: "16px"}}
				/>
			</div>
			{searchAction ? <Navigate to={"/search?q=" + search}/> : <div/>}

			{/* Check if user is authenticated */}
			{isAuthenticated ? (
				<Menu
					mode="horizontal"
					style={{lineHeight: "64px", float: "right"}}
				>
					<SubMenu
						id="user-menu-link"
						title={
							<div>
								<Avatar
									style={{
										backgroundColor: "#FAF",
									}}
								/>
								<Typography.Text style={{marginLeft: 10}}>
									{user?.email}
								</Typography.Text>
							</div>
						}
					>
						<Menu.Item>
							<Link to="/profile/projects">
								<FolderOutlined/>
								Your projects
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link to="/profile/servers">
								<HddOutlined/>
								Your servers
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link to="/profile/organizations">
								<ApartmentOutlined/>
								Your Organizations
							</Link>
						</Menu.Item>
						<Menu.Divider/>
						<Menu.Item>
							<Link to="/profile/settings">
								<SettingOutlined/>
								Settings
							</Link>
						</Menu.Item>
						<Menu.Item onClick={() => logout({ returnTo: window.location.origin })} id="logout-link">
							<LogoutOutlined/>
							Logout
						</Menu.Item>
					</SubMenu>
				</Menu>
			) : (
				<Menu mode="horizontal" style={{lineHeight: "64px", float: "right"}}>
					<Menu.Item>
						<div id="sign-in-link" onClick={() => loginWithRedirect()}>Sign in</div>;
						{/*<LoginBtn/>*/}
					</Menu.Item>
				</Menu>
			)}
		</Header>
	);
}

export default Navbar;
