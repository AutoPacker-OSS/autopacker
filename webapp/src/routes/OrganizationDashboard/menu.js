import {FolderOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";

export function getMenu(organizationName) {
	return [
		{
			key: "sub1",
			icon: <FolderOutlined />,
			text: "Projects",
			items: [
				{
					key: "projectOverviews",
					role: null,
					to: "/organization/dashboard/" + organizationName,
					text: "Overview"
				},
				{
					key: "projectRequests",
					role: "ADMIN",
					to: "/organization/project-requests/" + organizationName,
					text: "Project Requests"
				}
			]
		},
		{
			key: "sub2",
			icon: <TeamOutlined />,
			text: "Members",
			items: [
				{
					key: "membersOverview",
					role: null,
					to: "/organization/members/" + organizationName,
					text: "Overview"
				},
				{
					key: "applicants",
					role: "ADMIN",
					to: "/organization/applicants/" + organizationName,
					text: "Applicants"
				},
				{
					key: "roleControl",
					role: "ADMIN",
					to: "/organization/rolecontrol/" + organizationName,
					text: "Role Control"
				}
			]
		},{
			key: "sub3",
			icon: <UserOutlined />,
			text: "Personal",
			items: [
				{
					key: "createProject",
					role: null,
					to: "/organization/create-project/" + organizationName,
					text: "Create Project"
				},
				{
					key: "projects",
					role: null,
					to: "/organization/pre-submission/" + organizationName,
					text: "Projects"
				},
				{
					key: "submissions",
					role: null,
					to: "/organization/submissions/" + organizationName,
					text: "Submissions"
				}
			]
		}
	]
}