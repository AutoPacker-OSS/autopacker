import { Card, Col, Layout, Menu, Row } from "antd";
import React from "react";
import AccountSetting from "./components/Account/AccountSetting";
import PasswordSetting from "./components/Password/PasswordSetting";
// Components
import ProfileSetting from "./components/Profile/ProfileSetting";

function Settings() {
	// State
	const [activeOption, setActiveOption] = React.useState(1);

	const { Content } = Layout;

	const getActiveMenuOption = () => {
		switch (activeOption) {
			case 1:
				return <ProfileSetting />;

			case 2:
				return <AccountSetting />;

			case 3:
				return <PasswordSetting />;

			default:
				setActiveOption(1);
				return <ProfileSetting />;
		}
	};

	return (
		<Content
			style={{
				margin: "24px 16px",
				padding: 24,
				background: "#fff",
			}}
		>
			<Row gutter={[24, 0]}>
				{/* Settings menu */}
				<Col xs={24} md={7}>
					<Card bodyStyle={{ padding: 0 }} title="Personal settings">
						<Menu style={{ padding: 0 }} mode="inline" defaultSelectedKeys={["1"]}>
							<Menu.Item
								key="1"
								style={{
									margin: 0,
									borderBottom: "1px solid lightgrey",
									borderTop: "1px solid lightgrey",
								}}
								onClick={() => setActiveOption(1)}
							>
								Profile
							</Menu.Item>
							<Menu.Item
								key="2"
								style={{ margin: 0, borderBottom: "1px solid lightgrey" }}
								onClick={() => setActiveOption(2)}
							>
								Account
							</Menu.Item>
							<Menu.Item
								key="3"
								style={{ margin: 0 }}
								onClick={() => setActiveOption(3)}
							>
								Password
							</Menu.Item>
						</Menu>
					</Card>
				</Col>
				{/* Settings Content */}
				<Col xs={24} md={17}>
					{getActiveMenuOption()}
				</Col>
			</Row>
		</Content>
	);
}

export default Settings;
