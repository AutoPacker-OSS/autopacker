import {ApartmentOutlined, FolderOutlined, HddOutlined} from "@ant-design/icons";
import React from "react";

export const menus = [
	{
		key: "projects",
		to: "/profile/projects",
		icon: <FolderOutlined style={{ marginRight: 10}}/>,
		text: "Your Projects"
	},
	{
		key: "servers",
		to: "/profile/servers",
		icon: <HddOutlined style={{ marginRight: 10}}/>,
		text: "Your Servers"
	},
	{
		key: "organizations",
		to: "/profile/organizations",
		icon: <ApartmentOutlined style={{ marginRight: 10}}/>,
		text: "Your Organizations"
	}
];
