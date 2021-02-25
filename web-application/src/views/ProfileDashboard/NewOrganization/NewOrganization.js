import {Button, Form, Input, Layout, PageHeader, Tooltip, Typography, Spin, Radio} from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { createAlert } from "../../../store/actions/generalActions";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { breadcrumbItemRender } from "../../../util/breadcrumbItemRender";
import { QuestionCircleOutlined, LoadingOutlined } from "@ant-design/icons";

function NewOrganization() {
    // State
    const [orgName, setOrgName] = React.useState("");
    const [orgDesc, setOrgDesc] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [visibility, setVisibility] = React.useState("");
    const [sshKey, setSSHKey] = React.useState("");
    const [radioChecked, setRadioChecked] = React.useState(false);
    // Conditional rendering
    const [sshEnabled, setSSHEnabled] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // validation
    const [validOrgName, setValidOrgName] = React.useState(false);
    const [validUrl, setValidUrl] = React.useState(false);
    const [orgNameValidStatus, setOrgNameValidStatus] = React.useState("");
    const [urlValidStatus, setUrlValidStatus] = React.useState("");
    const [nameHelpText, setNameHelpText] = React.useState("");
    //econst [ipHelpText, setIpHelpText] = React.useState("");

    // Get antd sub components
    const { Paragraph } = Typography;
    const { Content } = Layout;
    const { TextArea } = Input;

    const [keycloak] = useKeycloak();

    const dispatch = useDispatch();

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const routes = [
        {
            path: "/profile",
            breadcrumbName: "Dashboard",
        },
        {
            path: "/organizations",
            breadcrumbName: "Your Organizations",
        },
        {
            path: "/add",
            breadcrumbName: "Add Organizations",
        },
    ];



    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (keycloak.idTokenParsed.email_verified) {
            axios({
                method: "post",
                url:
                    process.env.REACT_APP_APPLICATION_URL +
                    process.env.REACT_APP_SERVER_MANAGER +
                    "/organization/new-organization",
                headers: {
                    Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
                },
                data: {
                    orgName: orgName,
                    orgDesc: orgDesc,
                    url: url,
                    username: visibility,
                    ssh: sshKey,
                },
            })
                .then(() => {
                    //console.log("OK");
                    dispatch(
                        createAlert(
                            "Organization Added",
                            "Organization has been successfully added.",
                            "success",
                            true
                        )
                    );
                    setLoading(false);
                    setRedirect(true);
                })
                .catch(() => {
                    dispatch(
                        createAlert(
                            "Failed to add organization",
                            "You can't name the organization the same as another organization",
                            "error",
                            true
                        )
                    );
                    setLoading(false);
                });
        } else {
            dispatch(
                createAlert(
                    "Adding organization failed",
                    "You can't add a organization without verifying your account. Please check your email inbox for a verification email, and follow the instructions.",
                    "warning",
                    true
                )
            );
        }
    };

    const validateName = (value) => {
        console.log(value);
        if (value.trim().length <= 0) {
            setValidOrgName(false);
            setOrgNameValidStatus("error");
            setNameHelpText("Please name your project");
        } else if (/^[a-zA-Z0-9-]+$/.test(value)) {
            setValidOrgName(true);
            setOrgNameValidStatus("success");
            setNameHelpText("");
        } else {
            setValidOrgName(false);
            setOrgNameValidStatus("error");
            setNameHelpText(
                "Only letters, numbers and dashes are allowed. Spaces and special characters not allowed"
            );
        }
        setOrgName(value);
    };

    return (
        <div style={{ width: "100%" }}>
            <PageHeader
                style={{
                    border: "1px solid rgb(235, 237, 240)",
                    backgroundColor: "#FFFFFF",
                }}
                title="Add Organization"
                breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
            >
                <Paragraph>Fill in the form below to add a new organization</Paragraph>
            </PageHeader>
            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    background: "#fff",
                    minHeight: 280,
                }}
            >
                {redirect ? <Redirect to="/profile/organizations" /> : <div />}
                <Form {...formItemLayout}>
                    <Form.Item
                        name="organizationName"
                        label="Org Name:"
                        hasFeedback
                        validateStatus={orgNameValidStatus}
                        help={nameHelpText}
                        style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input onChange={(e) => validateName(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="organizationDescription"
                        label="Org Description"
                        style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
                    >
                        <TextArea onChange={(e) => setOrgDesc(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="organizationURL"
                        label="Organization URL"
                        style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
                    >
                        <TextArea onChange={(e) => setUrl(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                                name="organizationVisibility"
                                label={
                                   <span>
								Visibility&nbsp;
                                       <Tooltip title="Visibility to see the organization">
									<QuestionCircleOutlined />

								</Tooltip>
							</span>
                               }
                               style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400, }}
                               rules={[
                                   {
                                       required: true,
                                   },
                               ]}>


                        <Radio.Group value="Public">
                            <Radio

                                value="Public"
                                onChange={() => {
                                    setRadioChecked(true);
                                    setVisibility("Public");
                                }}
                            >
                                Public
                            </Radio>
                            <Radio
                                value="Private"
                                onChange={() => {
                                    setRadioChecked(true);
                                    setVisibility("Private");
                                }}
                            >
                                Private
                            </Radio>
                        </Radio.Group>
                    </Form.Item>

                    {sshEnabled ? (
                        <Form.Item
                            label="SSH Key"
                            style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 400 }}
                        >
                            <TextArea onChange={(e) => setSSHKey(e.target.value)} />
                        </Form.Item>
                    ) : (
                        <div />
                    )}
                    <div
                        style={{ width: "100%", textAlign: "center" }}
                        onClick={(e) => handleSubmit(e)}
                    >
                        {loading ? (
                            <div>
                                <Spin
                                    style={{
                                        width: "100%",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginBottom: 10,
                                    }}
                                    indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                                />
                                <p>This might take a while. Please be patient...</p>
                            </div>
                        ) : (
                            <Button
                                disabled={
                                    !validOrgName || !radioChecked
                                }
                                type="primary"
                            >
                                Create Organization
                            </Button>
                        )}
                    </div>
                </Form>
            </Content>
        </div>
    );
}

export default NewOrganization;
