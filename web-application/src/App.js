import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
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
const Servers = React.lazy(() => import("./views/ProfileDashboard/Servers/Servers"));
const ServerOverview = React.lazy(() => import("./views/ProfileDashboard/ServerOverview/ServerOverview"));
const NewServer = React.lazy(() => import("./views/ProfileDashboard/NewServer/NewServer"));
const NewProject = React.lazy(() => import("./views/ProfileDashboard/NewProject/NewProject"));
const NewOrganization = React.lazy(() => import("./views/ProfileDashboard/NewOrganization/NewOrganization"));
// const Verification = React.lazy(() => import("./views/Verification/Verification"));
const SearchResult = React.lazy(() => import("./views/SearchResult/SearchResult"));
const ProfilePage = React.lazy(() => import("./views/ProfilePage/ProfilePage"));
const ProfileProjectOverview = React.lazy(() => import("./views/ProfileProjectOverview/ProfileProjectOverview"));
const Settings = React.lazy(() => import("./views/ProfileDashboard/Settings/Settings"));
const OrganizationDashboard = React.lazy(() => import("./views/OrganizationDashboard/Dashboard/OrganizationDashboard"));
const Organizations = React.lazy(() => import("./views/ProfileDashboard/Organizations/Organizations"));
const Members = React.lazy(() => import("./views/OrganizationDashboard/Members/Members"));
const Applicants = React.lazy(() => import("./views/OrganizationDashboard/Applicants/Applicants"));
const ProjectRequests = React.lazy(() => import("./views/OrganizationDashboard/ProjectRequests/ProjectRequests"));
const ProjectSettings = React.lazy(() => import("./views/ProfileDashboard/ProjectSettings/ProjectSettings"));
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
	const [keycloak] = useKeycloak();

	let router = null;
	if (keycloak.authenticated) {
		router = (
			<React.Fragment>
				{/*Organization*/}
				<OrganizationDashboardRoute path="/organization/submissions/:organization" component={Submissions} />
				<OrganizationDashboardRoute path="/organization/project-requests/:organization" component={ProjectRequests} />
				<OrganizationDashboardRoute path="/organization/submit-project/:organization" component={SubmitProject} />
				<OrganizationDashboardRoute path="/organization/dashboard/:organization" component={OrganizationDashboard} />
				<OrganizationDashboardRoute path="/organization/applicants/:organization" component={Applicants} />
				<OrganizationDashboardRoute path="/organization/members/:organization" component={Members} />
				<ProfileDashboardRoute exact path="/profile/organization/add/" component={NewOrganization}/>

				{/*Servers*/}
				<ProfileDashboardRoute exact path="/profile/servers" component={Servers} />
				<ProfileDashboardRoute exact path="/profile/servers/add" component={NewServer} />
				<ProfileDashboardRoute exact path="/profile/servers/overview/:server" component={ServerOverview} />
				<ProfileDashboardRoute path="/profile/servers/overview/:server/settings" component={ServerSettings} />


				{/*Projects*/}
				<ProfileDashboardRoute exact path="/profile/projects" component={Projects} />
				<ProfileDashboardRoute exact path="/profile/projects/new" component={NewProject} />
				<ProfileDashboardRoute exact path="/profile/projects/add-module" component={ModuleSelection} />
				<ProfileDashboardRoute exact path="/profile/projects/overview/:project" component={ProjectOverview} />
				<ProfileDashboardRoute path="/profile/projects/overview/:project/settings" component={ProjectSettings} />

				<ProfileDashboardRoute path="/profile/organizations" component={Organizations} />
				<ProfileDashboardRoute path="/profile/settings" component={Settings} />
				<ProfileDashboardRoute exact path="/profile" component={Dashboard} />

				{/*Public views, no sign-in required*/}
				<PublicLazyRoute path="/organization/:organization/membership" component={ProfileOrganizationForm} />
				<PublicLazyRoute exact path="/organization/:organization" component={ProfileOrganizationOverview} />
				<PublicLazyRoute path="/account/:username/project/:project" component={ProfileProjectOverview} />
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
