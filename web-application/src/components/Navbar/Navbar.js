import { Input, Layout, Menu, Avatar, Typography } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
// Import styles
import "./NavbarStyle.scss";

import { selectMenuOption } from "../../store/actions/generalActions";
import LoginBtn from "../Login/LoginBtn";
import {
	FolderOutlined,
	HddOutlined,
	ApartmentOutlined,
	SettingOutlined,
	LogoutOutlined,
} from "@ant-design/icons";

/**
 * Represents the navigation bar at the top of the homepage
 */
function Navbar() {
	// state
	const [search, setSearch] = React.useState("");
	const [searchAction, setSearchAction] = React.useState(false);

	// Keycloak hook
	const [keycloak] = useKeycloak();

	// Get antd sub components
	const { Header } = Layout;
	const { SubMenu } = Menu;
	const { Search } = Input;

	// Get state from redux store
	const selectedMenuItem = useSelector((state) => state.general.selectedMenuOption);
	const dispatch = useDispatch();

	useEffect(() => {
		setSearchAction(false);
	}, [searchAction]);

	const logout = () => {
		keycloak.logout({
			redirectUri: process.env.REACT_APP_REDIRECT_URL,
		});
	};

	return (
		<Header className="header">
			{keycloak.authenticated ? (
				<Link to="/profile/projects" id="main-dashboard-link">
					<b style={{ fontSize: 16, float: "left" }}>AutoPacker</b>
				</Link>
			) : (
				<Link to="/">
					<b style={{ fontSize: 16, float: "left" }}>AutoPacker</b>
				</Link>
			)}
			<Menu mode="horizontal" style={{ lineHeight: "64px", float: "left" }}>
				<Menu.Item>
					<Search
						placeholder="Search users, projects ..."
						onChange={(e) => setSearch(e.target.value)}
						onSearch={() => setSearchAction(true)}
						style={{ width: 200 }}
					/>
				</Menu.Item>
			</Menu>
			{searchAction ? <Redirect to={"/search?q=" + search} /> : <div />}

			{/* Check if user is authenticated */}
			{keycloak.authenticated ? (
				<Menu
					mode="horizontal"
					selectedKeys={[selectedMenuItem]}
					onClick={(e) => dispatch(selectMenuOption(e.key))}
					style={{ lineHeight: "64px", float: "right" }}
				>
					{/* TODO Uncomment this when we have implemented the functionality for it */}
					{/* <Menu.Item key="bell" style={{}}>
					<Icon type="bell" style={{ margin: 0 }} />
				</Menu.Item> */}

					<SubMenu
						title={
							<div>
								<Avatar
									style={{
										backgroundColor: "#FAF",
									}}
								/>
								<Typography.Text style={{ marginLeft: 10 }}>
									{keycloak.idTokenParsed.preferred_username}
								</Typography.Text>
							</div>
						}
					>
						<Menu.Item key="1">
							<Link to="/profile/projects">
								<FolderOutlined />
								Your projects
							</Link>
						</Menu.Item>
						<Menu.Item key="2">
							<Link to="/profile/servers">
								<HddOutlined />
								Your servers
							</Link>
						</Menu.Item>
						<Menu.Item key="3">
							<Link to="/profile/organizations">
								<ApartmentOutlined />
								Your Organizations
							</Link>
						</Menu.Item>
						<Menu.Divider />
						<Menu.Item key="99">
							<Link to="/profile/settings">
								<SettingOutlined />
								Settings
							</Link>
						</Menu.Item>
						<Menu.Item id="logout" key="logout" onClick={() => logout()}>
							<LogoutOutlined />
							Logout
						</Menu.Item>
					</SubMenu>
				</Menu>
			) : (
				<Menu mode="horizontal" style={{ lineHeight: "64px", float: "right" }}>
					<Menu.Item key="signin">
						<LoginBtn />
					</Menu.Item>
				</Menu>
			)}
		</Header>
	);
}

export default Navbar;
