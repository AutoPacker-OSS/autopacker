import {Button, Card, Col, Input, Layout, PageHeader, Row, Typography} from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {Link, Redirect} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
// Import redux actions
import axios from "axios";
// Import custom hooks
import useDebounce from "./../../../hooks/useDebounce";

function Organizations() {
	// State
	const [search, setSearch] = React.useState("");
	const [organizations, setOrganizations] = React.useState([]);
	const [selectedCard, setSelectedCard] = React.useState(null);

	const [keycloak] = useKeycloak();

	const debouncedSearchTerm = useDebounce(search, 500);

	//Button width/height size initial state
	const [btnWidth, setBtnWidth] = React.useState(0);
	const [btnHeight, setBtnHeight] = React.useState(0);
	const ref = React.useRef(null);

	// Get antd sub components
	const { Paragraph } = Typography;
	const { Content } = Layout;
	const { Search } = Input;
	const { Meta } = Card;



	useEffect(() => {
			if (ref.current && ref.current.getBoundingClientRect().width) {
				setBtnWidth(ref.current.getBoundingClientRect().width);
			}
			if (ref.current && ref.current.getBoundingClientRect().height) {
				setBtnHeight(ref.current.getBoundingClientRect().height);
			}
		});

	useEffect(() => {
		setSelectedCard(null);
	}, []);

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
						"/organization/" +
						keycloak.idTokenParsed.preferred_username +
						"/isMember/search?q=" +
						search,
					headers: {
						Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
					},
				}).then(function (response) {
					if (response.data) {
						setOrganizations(response.data);
					} else {
						setOrganizations([]);
					}
				});
			} else {
				axios({
					method: "get",
					url:
						process.env.REACT_APP_APPLICATION_URL +
						process.env.REACT_APP_API +
						"/organization/" +
						keycloak.idTokenParsed.preferred_username +
						"/isMember",
					headers: {
						Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
					},
				}).then(function (response) {
					if (response.data) {
						setOrganizations(response.data);
					} else {
						setOrganizations([]);
					}
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
			path: "profile/dashboard",
			breadcrumbName: "Dashboard",
		},
		{
			path: "profile/organizations",
			breadcrumbName: "Your Organizations",
		},
	];

	const selectCard = (name) => {
		sessionStorage.setItem("selectedOrganizationName", name);
		setSelectedCard(name)
	};

	return (
		<div style={{ width: "100%" }}>
			<PageHeader
				style={{
					border: "1px solid rgb(235, 237, 240)",
					backgroundColor: "#FFFFFF",
				}}
				title="Your Organizations"
				breadcrumb={{ routes }}
			>
				<Paragraph>List of all the organizations you are affiliated with</Paragraph>
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
					style={{ width: "90%", marginRight: "auto" }}
					placeholder="Search organization.."
					onChange={(e) => setSearch(e.target.value)}
				/>

				<Button style={btnWidth && btnHeight
					? {
						width: `${btnWidth}px`,
						height: `${btnHeight}px`,
					}
					: {}} type="primary">
				<Link id="new-organization-link" to="/profile/organization/add">New Organization</Link>
				</Button>
				</div>
				<Row style={{ marginTop: 20 }} gutter={[24, 24]}>
					{organizations.map((organization) => (
						<Col xs={24} lg={8} xl={6} key={organization.id}>
							{selectedCard !== null ?(
								<Redirect to={"/organization/dashboard/" + selectedCard} />
							) : (
								<div />
							)}

							<Card
								hoverable
								style={{ width: 240, height: 310 }}
								onClick={() => selectCard(organization.name)}
								cover={
									<img
										alt="Organization logo"
										src={
											"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"
										}
									/>
								}
							>
								<Meta
									title={organization.name}
									description={<Paragraph ellipsis={{ rows: 3 }}>{organization.description}</Paragraph>}
								/>
							</Card>
						</Col>
					))}
				</Row>
			</Content>
		</div>
	);
}

export default Organizations;
