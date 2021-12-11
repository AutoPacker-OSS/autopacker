import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// Import custom route
import PublicOutlet from "./routes/PublicOutlet/PublicOutlet";
import ProfileOutlet from "./routes/ProfileOutlet/ProfileOutlet";
import OrganizationOutlet from "./routes/OrganizationOutlet/OrganizationOutlet";
// Custom alert

// Lazy Loading Views setup (only loaded when needed)
import Home from "./views/Home/Home";
import Dashboard from "./views/ProfileDashboard/Dashboard/Dashboard";
import Projects from "./views/ProfileDashboard/Projects/Projects";
import ProjectOverview from "./views/ProfileDashboard/ProjectOverview/ProjectOverview";
import OrgProjectOverview from "./views/OrganizationDashboard/OrgProjectOverview/OrgProjectOverview";
import Servers from "./views/ProfileDashboard/Servers/Servers";
import ServerOverview from "./views/ProfileDashboard/ServerOverview/ServerOverview";
import NewServer from "./views/ProfileDashboard/NewServer/NewServer";
import NewProject from "./views/ProfileDashboard/NewProject/NewProject";
import NewOrganization from "./views/ProfileDashboard/NewOrganization/NewOrganization";
import RoleControl from "./views/OrganizationDashboard/RoleControl/RoleControl";
import SearchResult from "./views/SearchResult/SearchResult";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import ProfileProjectOverview from "./views/ProfileProjectOverview/ProfileProjectOverview";
import Settings from "./views/ProfileDashboard/Settings/Settings";
import OrganizationDashboard from "./views/OrganizationDashboard/Dashboard/OrganizationDashboard";
import Organizations from "./views/ProfileDashboard/Organizations/Organizations";
import Members from "./views/OrganizationDashboard/Members/Members";
import Applicants from "./views/OrganizationDashboard/Applicants/Applicants";
import ProjectRequests from "./views/OrganizationDashboard/ProjectRequests/ProjectRequests";
import ProjectSettings from "./views/ProfileDashboard/ProjectSettings/ProjectSettings";
import SubmitProject from "./views/OrganizationDashboard/SubmitProject/SubmitProject";
import ProfileOrganizationOverview from "./views/ProfileOrganizationOverview/ProfileOrganizationOverview";
import ProfileOrganizationForm from "./views/ProfileOrganizationForm/ProfileOrganizationForm";
import Submissions from "./views/OrganizationDashboard/Submissions/Submissions";
import ModuleSelection from "./views/ProfileDashboard/AddModule/ModuleSelection";
import ServerSettings from "./views/ProfileDashboard/ServerSettings/ServerSettings";

/**
 * Handles the routing mechanism in the application
 */
function App() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	let router = null;
	if (user !== null ? isAuthenticated : false) {
		router = (
			<React.Fragment>
				<Route
					path="/signin"
					render={() => (
						<Suspense fallback={<div />}>
							<Navigate to={"/profile/projects"} />
						</Suspense>
					)}
				/>
				{/* This route is on the bottom of the list */}
				<Route
					exact
					path="/"
					element={<Home />}
				/>

				<Route path="/organization" element={<OrganizationOutlet />}>
					<Route path="submissions/:organizationName" element={<Submissions />} />
					<Route path="project-requests/:organizationName" element={<ProjectRequests />} />
					<Route path="submit-project/:organizationName" element={<SubmitProject />}/>
					<Route path="dashboard/:organizationName" element={<OrganizationDashboard />}/>
					<Route path=":organization/overview/:projectName" element={<OrgProjectOverview />} />
					<Route path="applicants/:organizationName" element={<Applicants />} />
					<Route path="members/:organizationName" element={<Members />}/>
					<Route path="rolecontrol/:organizationName" element={<RoleControl />} />
				</Route>

				<Route path="/profile" element={<ProfileOutlet />}>
					<Route exact path="organization/add/" element={<NewOrganization />}/>
					<Route exact path="servers" element={<Servers />} />
					<Route exact path="servers/add" element={<NewServer />} />
					<Route exact path="servers/overview/:serverName" element={<ServerOverview />} />
					<Route path="servers/overview/:serverName/settings" element={<ServerSettings />} />
					<Route exact path="projects" element={<Projects />} />
					<Route exact path="projects/new" element={<NewProject/>} />
					<Route exact path="projects/add-module" element={<ModuleSelection />} />
					<Route exact path="projects/overview/:projectName" element={<ProjectOverview />} />
					<Route path="projects/overview/:projectName/settings" element={<ProjectSettings />} />
					<Route path="organizations" element={<Organizations />} />
					<Route path="settings" element={<Settings />} />
					<Route exact path="" element={<Dashboard />} />
				</Route>

				<Route path="/" element={<PublicOutlet />}>
					<Route path="organization/:organizationName/membership" element={<ProfileOrganizationForm />} />
					<Route exact path="organization/:organizationName" element={<ProfileOrganizationOverview />} />
					<Route path="account/:username/project/:projectName" element={<ProfileProjectOverview />} />
					<Route exact path="account/:username" element={<ProfilePage />} />
					<Route path="search" element={<SearchResult />} />
				</Route>
			</React.Fragment>
		);
	} else {
		router = (
			<React.Fragment>
				<Route
					exact
					path="/"
					element={<Home />}
				/>

				{/*Public views, no sign-in required*/}
				<Route path="/" element={<PublicOutlet />}>
					<Route path="organization/:organizationName/membership" element={<ProfileOrganizationForm />} />
					<Route exact path="organization/:organizationName" element={<ProfileOrganizationOverview />} />
					<Route path="account/:username/project/:projectName" element={<ProfileProjectOverview />} />
					<Route exact path="account/:username" element={<ProfilePage />} />
					<Route path="search" element={<SearchResult />} />
				</Route>
			</React.Fragment>
		);
	}

	return (
		<div>
			<Routes>
				{router}
			</Routes>
		</div>
	);
}

export default App;
