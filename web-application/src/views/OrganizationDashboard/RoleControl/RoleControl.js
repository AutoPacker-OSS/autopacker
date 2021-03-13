import {Layout, PageHeader, Table, Typography, Space, Select, Modal, Button} from "antd";

import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

function Members() {
    // State
    const [members, setMembers] = React.useState([]);
    const organizationName = sessionStorage.getItem("selectedOrganizationName");

    //Modal
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [roleModal, setRoleModal] = React.useState(false);


    const [user, setUser] = React.useState("");
    const [role, setRole] = React.useState("");

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


    const { Option } = Select;
    function changeRole(value, user, role) {
        setUser(user);
        setRole(role)
        setRoleModal(value);
    }

    function deleteMember(value, user){
        setDeleteModal(value);
        setUser(user);
    }
    function turnOffModal(value){
        setDeleteModal(value);
        setRoleModal(value);
    }

    // Table columns
    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            filterMultiple: false,
            sorter: (a, b) => b.username.localeCompare(a.username),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filterMultiple: false,
            sorter: (a, b) => b.role.localeCompare(a.role),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 300,
            render: (text, record) => (
                // eslint-disable-next-line react/jsx-no-undef
                <Space size="middle">
                    <>
                        <Select defaultValue="Change Role" style={{ width: 120 }} onChange={() => changeRole(true, record.username, record.role)}>
                            <Option value="Admin">Admin</Option>
                            <Option value="Owner">Owner</Option>
                            <Option value="Member">Member</Option>
                        </Select>
                    </>
                    <Button style={{ marginLeft: 20 }} type="danger" onClick={() => deleteMember(true, record.username)}>Delete</Button>
                </Space>
            )

        }
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
                <Table columns={columns} dataSource={members}>
                </Table>
                <Modal
                    title={"Are you sure, this can not be reverted?"}
                    centered
                    visible={deleteModal}
                    onOk={() => turnOffModal(false)}
                    onCancel={() => turnOffModal(false)}
                >
                    <p>
                       By accepting this, you will delete <b>{user}</b> from your organization?
                    </p>
                </Modal>
                <Modal
                    title={"Are you sure, this can not be reverted?"}
                    centered
                    visible={roleModal}
                    onOk={() => turnOffModal(false)}
                    onCancel={() => turnOffModal(false)}
                >
                    <p>By accepting this, change the role to <b>{user}</b> to role <b>{role}</b>.</p>
                    <p>Press <b>Ok</b> to confirm these changes.</p>
                </Modal>
            </Content>
        </div>
    );
}

export default Members;
