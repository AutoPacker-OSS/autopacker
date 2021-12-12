import { useAuth0 } from '@auth0/auth0-react';
import { Button, Layout } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import Identicon from '../../assets/image/download.png';
import ProfileAlert from '../../components/CustomAlerts/ProfileAlert';
import Navbar from '../../components/Navbar/Navbar';
// Import custom components
import { createAlert } from '../../store/actions/generalActions';
// Import styles
import '../RouteOutlet.scss';
import { menus } from './menu';

/**
 * The default layout for a profile dashboard route
 */
function ProfileDashboardLayout({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  const { user } = useAuth0();

  // Get antd sub components
  const { Sider, Content } = Layout;

  // TODO - refactor - code duplicate in OrganizationDashboardRoute
  // Get state from redux store
  // const selectedMenuItem = useSelector((state) => state.general.selectedMenuOption);
  const dispatch = useDispatch();

  const text = (
    <div>
      To be able to create, deploy and share projects, you need to verify your account. Didn't get the email?{' '}
      <Button
        style={{ padding: 0 }}
        type="link"
        onClick={() => {alert("Ups")}}>
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
function ProfileOutlet() {
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
