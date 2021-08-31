import {Layout, PageHeader, Table, Typography, Select, Modal, Button} from "antd";

import React, {useContext, useEffect} from "react";
import {useOktaAuth} from "@okta/okta-react";
import axios from "axios";
import {createAlert} from "../../../store/actions/generalActions";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useApi} from "../../../hooks/useApi";
import {UserContext} from "../../../context/UserContext";

function RoleControl() {
    // State
    const [members, setMembers] = React.useState([]);
    const { organizationName } = useParams();
    const [reload, setReload] = React.useState(false);

    //Modal
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [roleModal, setRoleModal] = React.useState(false);


    const [user, setUser] = React.useState("");
    const [newRole, setNewRole] = React.useState("");

    const { authState } = useOktaAuth();
    const {get, post} = useApi();
    const {userInfo} = useContext(UserContext);

    // Import sub components from antd
    const { Paragraph } = Typography;
    const { Content } = Layout;

    const dispatch = useDispatch();

    useEffect(() => {
        get(`/organization/${organizationName}/members`)
            .then(resp => {
                let arr = [];
                resp.data.forEach((member) => {
                    arr.push({
                        key: member.id,
                        username: member.username,
                        role: member.role,
                    });
                });
                setMembers(arr);
            });
    }, [authState.accessToken, organizationName, reload]);

    const handleChangeRole = (event) => {
        event.preventDefault();
        turnOffModal(false);
        if (userInfo.email_verified) {
            post(`/organization/changeRole`, {
                organizationName: organizationName,
                username: user,
                role: newRole
            }).then(() => {
                    dispatch(
                        createAlert(
                            "Role Request Submitted",
                            "You have successfully submitted the role changes.",
                            "success",
                            true
                        )
                    );
                    setReload(!reload);
                }).catch(() => {
                    dispatch(
                        createAlert(
                            "Role Request Failed",
                            "Something went wrong while trying to submit the role changes. Try again later.",
                            "error",
                            true
                        )
                    );
                });
        } else {
            dispatch(
                createAlert(
                    "Role Request Failed",
                    "You can't submit changes without being Admin of an organization and have a verified account.",
                    "warning",
                    true
                )
            );
        }
    };

    const handleUserDeletion = (event) => {
        event.preventDefault();
        turnOffModal(false);
        if (userInfo.email_verified) {
            post(`/organization/deleteMember`, {
                organizationName: organizationName,
                username: user
            }).then(() => {
                dispatch(
                    createAlert(
                        "Role Request Submitted",
                        "You have successfully submitted the deletion.",
                        "success",
                        true
                    )
                );
                setReload(!reload);
            }).catch(() => {
                dispatch(
                    createAlert(
                        "Deletion Request Failed",
                        "Something went wrong while trying to submit the deletion changes. Try again later.",
                        "error",
                        true
                    )
                );
            });
        } else {
            dispatch(
                createAlert(
                    "Deletion Request Failed",
                    "You can't submit changes without being Admin of an organization and have a verified account.",
                    "warning",
                    true
                )
            );
        }
    };

    const routes = [
        {
            path: "organization/dashboard",
            breadcrumbName: "Dashboard",
        },
        {
            path: "organization/rolecontrol",
            breadcrumbName: "Organization Role Control",
        },
    ];

    const { Option } = Select;
    function changeRoleModal(value, user, role) {
        setUser(user);
        setNewRole(role)
        setRoleModal(value);
    }

    function deleteMemberModal(value, user){
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
            title: 'Change Role',
            key: 'changeRole',
            fixed: 'right',
            width: 300,
            render: (text, record) => (
                         <Select defaultValue={record.role} style={{ width: 120 }} onChange={(value) => changeRoleModal(true, record.username, value)}>
                             <Option value="ADMIN">ADMIN</Option>
                             <Option value="OWNER">OWNER</Option>
                            <Option value="MEMBER">MEMBER</Option>
                        </Select>
            )

        },
        {
            title: 'Delete User',
            key: 'deleteUser',
            fixed: 'right',
            render: (text, record) => (
                    <Button style={{ marginLeft: 20 }} type="danger" onClick={() => deleteMemberModal(true, record.username)}>Delete</Button>
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
                    onOk={(e) => handleUserDeletion(e)}
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
                    onOk={(e) => handleChangeRole(e)}
                    onCancel={() => turnOffModal(false)}
                >
                    <p>By accepting this, change the role to <b>{user}</b> to role <b>{newRole}</b>.</p>
                    <p>Press <b>Ok</b> to confirm these changes.</p>
                </Modal>
            </Content>
        </div>
    );
}

export default RoleControl;
