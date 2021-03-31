import { Layout } from "antd";
import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function PublicViewLayout({ children }) {
	// Get antd sub components
	const { Content } = Layout;

	return (
		<Layout>
			{/* Navbar */}
			<Navbar />
			{/* Content */}
			<Content style={{ backgroundColor: "white" }}>{children}</Content>
		</Layout>
	);
}

// Public Route
const PublicLazyRoute = ({ component: Component, isAuthenticated, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => (
				<PublicViewLayout>
					<Suspense fallback={<div />}>
						<Component {...props} />
					</Suspense>
				</PublicViewLayout>
			)}
		/>
	);
};

export default PublicLazyRoute;
