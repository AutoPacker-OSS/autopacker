import { Layout, PageHeader, Table, Typography } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

function Members() {
    // State
    const [members, setMembers] = React.useState([]);

    const organizationName = sessionStorage.getItem("selectedOrganizationName");

    const [keycloak] = useKeycloak();

    // Import sub components from antd
    const { Paragraph } = Typography;
    const { Content } = Layout;

    useEffect(() => {
        axios({
            method: "get",
            url:
                process.env.REACT_APP_APPLICATION_URL +
                process.env.REACT_APP_GENERAL_API +
                "/organization/" +
                organizationName +
                "/members",
            headers: {
                Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
            },
        }).then(function (response) {
            let arr = [];
            response.data.forEach((member) => {
                arr.push({
                    key: member.id,
                    username: member.username,
                    role: member.role.name,
                });
            });
            setMembers(arr);
        });
    }, []);

    const routes = [
        {
            path: "organization/dashboard",
            breadcrumbName: "Dashboard",
        },
        {
            path: "organization/rolecontrol",
            breadcrumbName: "Organization Members",
        },
    ];

    // Table columns
    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            filterMultiple: false,
            sorter: (a, b) => b.username.localeCompare(a.username),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Role",
            dataIndex: "role",
            filterMultiple: false,
            sorter: (a, b) => b.role.localeCompare(a.role),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Role",
            dataIndex: "role",
            filterMultiple: false,
            sorter: (a, b) => b.role.localeCompare(a.role),
            sortDirections: ["descend", "ascend"],
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            <PageHeader
                style={{
                    border: "1px solid rgb(235, 237, 240)",
                    backgroundColor: "#FFFFFF",
                }}
                title={organizationName + " Members"}
                breadcrumb={{ routes }}
            >
                <Paragraph>Table containing all the members affiliated with the organization in some way.</Paragraph>
            </PageHeader>
            {}
            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    background: "#fff",
                    minHeight: 280,
                }}
            >
                <Table columns={columns} dataSource={members} />
            </Content>
        </div>
    );
}

export default Members;
