import { Button, Col, Input, Layout, PageHeader, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import axios from "axios";
// Import custom hooks
import useDebounce from "./../../../hooks/useDebounce";
// Import helper methods
// Import custom components
import ServerRow from "./components/ServerRow";
import {breadcrumbItemRender} from "../../../util/breadcrumbItemRender";

function Servers() {
	// State
	const [search, setSearch] = React.useState("");
	const [servers, setServers] = React.useState([]);

	const { authState } = useOktaAuth();

	const debouncedSearchTerm = useDebounce(search, 500);

	//Button width/height size initial state
	const [btnWidth, setBtnWidth] = React.useState(0);
	const [btnHeight, setBtnHeight] = React.useState(0);
	const ref = React.useRef(null);

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Search } = Input;


	useEffect(() => {
		if (ref.current && ref.current.getBoundingClientRect().width) {
			setBtnWidth(ref.current.getBoundingClientRect().width);
		}
		if (ref.current && ref.current.getBoundingClientRect().height) {
			setBtnHeight(ref.current.getBoundingClientRect().height);
		}
	});

	// Inspired from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
	useEffect(
		() => {
			// Make sure we have a value (user has entered something in input)
			if (debouncedSearchTerm) {
				// Fire off our API call
				axios({
					method: "get",
					url:
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_API +
					"/server/" +
					search,
					headers: {
						Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
					},
				}).then(function (response) {
					setServers(response.data);
				});
			} else {
				axios({
					method: "get",
					url:
					process.env.REACT_APP_APPLICATION_URL +
					process.env.REACT_APP_API +
					"/server",
					headers: {
						Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
					},
				}).then(function (response) {
					setServers(response.data);
				});
			}
		},
		// This is the useEffect input array
		// Our useEffect function will only execute if this value changes ...
		// ... and thanks to our hook it will only change if the original ...
		// value (searchTerm) hasn't changed for more than 500ms.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[debouncedSearchTerm]
	);

	const routes = [
		{
			path: "/profile",
			breadcrumbName: "Dashboard",
		},
		{
			path: "/servers",
			breadcrumbName: "Your Servers",
		},
	];

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Your Servers"
				breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
			>
				<Paragraph>List of all your servers</Paragraph>
			</PageHeader>
			{/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
			<Content
				style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
					minHeight: 280,
				}}
			>
				<div style={{ display: "flex" }}>
					<Search
						style={{ width: "90%", marginRight: "5%" }}
					placeholder="Search server.."
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button style={btnWidth && btnHeight
					? {
						width: `${btnWidth}px`,
						height: `${btnHeight}px`,
					}
					: {}} type="primary">
					<Link id="new-server-link" to="/profile/servers/add">New Server</Link>
				</Button>
				</div>
				<Row style={{ marginTop: 20 }} gutter={[24, 24]}>
					{servers.map((server) => (
						<Col xs={24} key={server.serverId}>
							<ServerRow
								id={server.serverId}
								title={server.title}
								desc={server.description}
								status={server.status}
							/>
						</Col>
					))}
				</Row>
			</Content>
		</div>
	);
}

export default Servers;
