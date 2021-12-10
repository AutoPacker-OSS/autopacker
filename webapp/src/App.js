import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// Import custom route
import PublicLazyRoute from "./routes/PublicLazyRoute/PublicLazyRoute";
import ProfileDashboardRoute from "./routes/ProfileDashboard/ProfileDashboardRoute";
import OrganizationDashboardRoute from "./routes/OrganizationDashboard/OrganizationDashboardRoute";
// Custom alert

// Lazy Loading Views setup (only loaded when needed)
const Home = React.lazy(() => import("./views/Home/Home"));
const Dashboard = React.lazy(() => import("./views/ProfileDashboard/Dashboard/Dashboard"));
const Projects = React.lazy(() => import("./views/ProfileDashboard/Projects/Projects"));
const RedirectProfileHome = React.lazy(() => import("./components/Redirects/RedirectProfileHome"));
const ProjectOverview = React.lazy(() => import("./views/ProfileDashboard/ProjectOverview/ProjectOverview"));
const OrgProjectOverview = React.lazy(() => import("./views/OrganizationDashboard/OrgProjectOverview/OrgProjectOverview"));
const Servers = React.lazy(() => import("./views/ProfileDashboard/Servers/Servers"));
const ServerOverview = React.lazy(() => import("./views/ProfileDashboard/ServerOverview/ServerOverview"));
const NewServer = React.lazy(() => import("./views/ProfileDashboard/NewServer/NewServer"));
const NewProject = React.lazy(() => import("./views/ProfileDashboard/NewProject/NewProject"));
const NewOrganization = React.lazy(() => import("./views/ProfileDashboard/NewOrganization/NewOrganization"));
const RoleControl = React.lazy(() => import("./views/OrganizationDashboard/RoleControl/RoleControl"));
// const Verification = React.lazy(() => import("./views/Verification/Verification"));
const SearchResult = React.lazy(() => import("./views/SearchResult/SearchResult"));
const ProfilePage = React.lazy(() => import("./views/ProfilePage/ProfilePage"));
const ProfileProjectOverview = React.lazy(() => import("./views/ProfileProjectOverview/ProfileProjectOverview"));
const Settings = React.lazy(() => import("./views/ProfileDashboard/Settings/Settings"));
const OrganizationDashboard = React.lazy(() => import("./views/OrganizationDashboard/Dashboard/OrganizationDashboard"));
//const OrgPersonalProject = React.lazy(() => import("./views/OrganizationDashboard/OrgPersonalProject/OrgPersonalProject"));
//const PreSubmissionOverview = React.lazy(() => import("./views/OrganizationDashboard/PreSubmissionOverview/PreSubmissionOverview"));
const Organizations = React.lazy(() => import("./views/ProfileDashboard/Organizations/Organizations"));
const Members = React.lazy(() => import("./views/OrganizationDashboard/Members/Members"));
const Applicants = React.lazy(() => import("./views/OrganizationDashboard/Applicants/Applicants"));
const ProjectRequests = React.lazy(() => import("./views/OrganizationDashboard/ProjectRequests/ProjectRequests"));
const ProjectSettings = React.lazy(() => import("./views/ProfileDashboard/ProjectSettings/ProjectSettings"));
//const NewOrgProject = React.lazy(() => import("./views/OrganizationDashboard/NewOrgProject/NewOrgProject"));
const SubmitProject = React.lazy(() => import("./views/OrganizationDashboard/SubmitProject/SubmitProject"));
const ProfileOrganizationOverview = React.lazy(() => import("./views/ProfileOrganizationOverview/ProfileOrganizationOverview"));
const ProfileOrganizationForm = React.lazy(() => import("./views/ProfileOrganizationForm/ProfileOrganizationForm"));
const Submissions = React.lazy(() => import("./views/OrganizationDashboard/Submissions/Submissions"));
const ModuleSelection = React.lazy(() => import("./views/ProfileDashboard/AddModule/ModuleSelection"));
const ServerSettings = React.lazy(() => import("./views/ProfileDashboard/ServerSettings/ServerSettings"));

/**
 * Handles the routing mechanism in the application
 */
function App() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	let router = null;
	if (user !== null ? isAuthenticated : false) {
		router = (
			<React.Fragment>
				{/*Organization*/}

				<OrganizationDashboardRoute path="/organization/submissions/:organizationName" component={Submissions} />
				<OrganizationDashboardRoute path="/organization/project-requests/:organizationName" component={ProjectRequests} />
				{/*<OrganizationDashboardRoute path="/organization/create-project/:organizationName" component={NewOrgProject} />*/}
				<OrganizationDashboardRoute path="/organization/submit-project/:organizationName" component={SubmitProject}/>
				<OrganizationDashboardRoute path="/organization/dashboard/:organizationName" component={OrganizationDashboard}/>
				<OrganizationDashboardRoute path="/organization/:organization/overview/:projectName" component={OrgProjectOverview} />
				<OrganizationDashboardRoute path="/organization/applicants/:organizationName" component={Applicants} />
				<OrganizationDashboardRoute path="/organization/members/:organizationName" component={Members}/>
				{/*<OrganizationDashboardRoute path="/organization/pre-submission/:organizationName" component={OrgPersonalProject*/}
				{/*<OrganizationDashboardRoute path="/organization/pre-submission-overview/:organizationName/:projectName" component={PreSubmissionOverview} />*/}
				<OrganizationDashboardRoute path="/organization/rolecontrol/:organizationName" component={RoleControl} />
				<ProfileDashboardRoute exact path="/profile/organization/add/" component={NewOrganization}/>

				{/*Servers*/}
				<ProfileDashboardRoute exact path="/profile/servers" component={Servers} />
				<ProfileDashboardRoute exact path="/profile/servers/add" component={NewServer} />
				<ProfileDashboardRoute exact path="/profile/servers/overview/:serverName" component={ServerOverview} />
				<ProfileDashboardRoute path="/profile/servers/overview/:serverName/settings" component={ServerSettings} />


				{/*Projects*/}
				<ProfileDashboardRoute exact path="/profile/projects" component={Projects} />
				<ProfileDashboardRoute exact path="/profile/projects/new" component={NewProject} />
				<ProfileDashboardRoute exact path="/profile/projects/add-module" component={ModuleSelection} />
				<ProfileDashboardRoute exact path="/profile/projects/overview/:projectName" component={ProjectOverview} />
				<ProfileDashboardRoute path="/profile/projects/overview/:projectName/settings" component={ProjectSettings} />

				<ProfileDashboardRoute path="/profile/organizations" component={Organizations} />
				<ProfileDashboardRoute path="/profile/settings" component={Settings} />
				<ProfileDashboardRoute exact path="/profile" component={Dashboard} />

				{/*Public views, no sign-in required*/}
				<PublicLazyRoute path="/organization/:organizationName/membership" component={ProfileOrganizationForm} />
				<PublicLazyRoute exact path="/organization/:organizationName" component={ProfileOrganizationOverview} />
				<PublicLazyRoute path="/account/:username/project/:projectName" component={ProfileProjectOverview} />
				{/* <PublicLazyRoute path="/registrationConfirmation" component={Verification} /> */}
				<PublicLazyRoute exact path="/account/:username" component={ProfilePage} />
				<PublicLazyRoute path="/search" component={SearchResult} />

				<Route
					path="/signin"
					render={() => (
						<Suspense fallback={<div />}>
							<RedirectProfileHome />
						</Suspense>
					)}
				/>
				{/* This route is on the bottom of the list */}
				<Route
					exact
					path="/"
					render={() => (
						<Suspense fallback={<div />}>
							<Home />
						</Suspense>
					)}
				/>
			</React.Fragment>
		);
	} else {
		router = (
			<React.Fragment>
				<PublicLazyRoute exact path="/organization/:organization" component={ProfileOrganizationOverview} />
				<PublicLazyRoute path="/account/:username/project/:project" component={ProfileProjectOverview} />
				{/* <PublicLazyRoute path="/registrationConfirmation" component={Verification} /> */}
				<PublicLazyRoute exact path="/account/:username" component={ProfilePage} />
				<PublicLazyRoute path="/search" component={SearchResult} />
				{/* <Route path="/login/callback" component={LoginCallback} /> */}
				{/* This route is on the bottom of the list */}
				<Route
					exact
					path="/"
					render={() => (
						<Suspense fallback={<div />}>
							<Home />
						</Suspense>
					)}
				/>
			</React.Fragment>
		);
	}

	return (
		<div>
			<Switch>{router}</Switch>
		</div>
	);
}

export default App;
