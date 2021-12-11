import { Button, Layout, Menu } from 'antd';
import { ApartmentOutlined, DesktopOutlined, FolderOutlined, HddOutlined } from '@ant-design/icons';
import React, { Suspense, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, NavLink, Outlet, Route, useNavigate } from 'react-router-dom';
import Identicon from '../../assets/image/download.png';
import ProfileAlert from '../../components/CustomAlerts/ProfileAlert';
import Navbar from '../../components/Navbar/Navbar';
import { menus } from './menu';
// Import custom components
import { createAlert } from '../../store/actions/generalActions';
import axios from 'axios';
// Import styles
import '../RouteOutlet.scss';
import { useApi } from '../../hooks/useApi';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * The default layout for a profile dashboard route
 */
function ProfileDashboardLayout({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { get } = useApi();

  // Get antd sub components
  const { Sider, Content } = Layout;

  // TODO - refactor - code duplicate in OrganizationDashboardRoute
  // Get state from redux store
  const selectedMenuItem = useSelector((state) => state.general.selectedMenuOption);
  const dispatch = useDispatch();

  const text = (
    <div>
      To be able to create, deploy and share projects, you need to verify your account. Didn't get the email?{' '}
      <Button
        style={{ padding: 0 }}
        type="link"
        onClick={() => {
          // TODO NOT SURE IF THIS IS USED ANYMORE AS WE ARE USING EXTERNAL IDP
          // const url =
          // 	process.env.REACT_APP_APPLICATION_URL +
          // 	process.env.REACT_APP_API +
          // 	"/auth/resendVerificationToken";
          //
          // axios
          // 	.get(url)
          // 	.then(() => {
          // 		dispatch(
          // 			createAlert(
          // 				"New verification token sent",
          // 				"Successfully sent a new verification token. Please check your inbox for a new verification email.",
          // 				"success",
          // 				true
          // 			)
          // 		);
          // 	})
          // 	.catch(() => {
          // 		dispatch(
          // 			createAlert(
          // 				"Request failed",
          // 				"Could not request a new verification token. Try again later or contact support here: contact@autopacker.no",
          // 				"error",
          // 				true
          // 			)
          // 		);
          // 	});
        }}>
        Click here to resend
      </Button>
    </div>
  );

  React.useEffect(() => {
    if (user.email_verified === false) {
      dispatch(createAlert('Please verify your email address', text, 'warning', true));
    }
  }, []);

  return (
    <Layout>
      {/* Navbar */}
      <Navbar />
      {/* Content */}

      <Layout style={{ minHeight: '95vh' }}>
        <Sider
          width={200}
          style={{ background: '#fff', padding: 0 }}
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}>
          <ul
            style={{ height: '100%', borderRight: '0 none' }}
            className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline">
            <div style={{ textAlign: 'center' }}>
              <img className="identicon" src={Identicon} alt="identicon" />
            </div>

            {menus.map((menuItem) => (
              <NavLink
                key={menuItem.key}
                id={'sidebar-link-' + menuItem.key}
                activeClassName="ant-menu-item-selected"
                to={menuItem.to}
                className="ant-menu-item ant-menu-item-only-child"
                style={{ paddingLeft: 24 }}>
                {menuItem.icon}
                {collapsed ? null : menuItem.text}
              </NavLink>
            ))}

            {/* Monitor */}
            {/*TODO FIX THIS AFTER CHANGING ROLE MANAGEMENT TO THE API*/}
            {/*{keycloak.realmAccess.roles.includes("ADMIN") ? (*/}
            {/*	<div className="ant-menu-item ant-menu-item-only-child" style={{paddingLeft: 24}}>*/}
            {/*		<a href="https://stage.autopacker.no/monitor/" target="_blank" rel="noopener noreferrer"*/}
            {/*		   id="sidebar-monitor-link">*/}
            {/*			<DesktopOutlined/>*/}
            {/*			{collapsed ? <div/> : "Monitor"}*/}
            {/*		</a>*/}
            {/*	</div>*/}
            {/*) : null}*/}
          </ul>
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
function ProfileOutlet({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <ProfileDashboardLayout>
      <Outlet />
    </ProfileDashboardLayout>
  ) : (
    <Navigate to="/" />
  );
}

export default ProfileOutlet;
