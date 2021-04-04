import {Card, Col, Layout, PageHeader, Row, Tag, Typography} from "antd";
import React, { useEffect } from "react";
import {Redirect, useParams} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import Moment from 'moment';

function OrgPersonalProject() {
// State
    const [projects, setProjects] = React.useState([]);
    const [selectedCard, setSelectedCard] = React.useState(null);

    const [keycloak] = useKeycloak();
    const { organizationName } = useParams();

    // Get antd sub components
    const { Paragraph } = Typography;
    const { Content } = Layout;
    const { Meta } = Card;



    useEffect(() => {
                axios({
                    method: "get",
                    url:
                        process.env.REACT_APP_APPLICATION_URL +
                        process.env.REACT_APP_FILE_DELIVERY_API +
                        "/organization/" +
                        organizationName +
                        "/projects/"+
                        keycloak.idTokenParsed.preferred_username,
                    headers: {
                        Authorization: keycloak.token !== null ? `Bearer ${keycloak.token}` : undefined,
                    },
                }).then(function (response) {
                    setProjects(response.data);
                });
        },
        [keycloak.idTokenParsed.preferred_username, keycloak.token, organizationName]
    );

    const routes = [
        {
            path: "organization/dashboard/" + organizationName,
            breadcrumbName: "Dashboard",
        },
        {
            path: "organization/pre-submission/" + organizationName,
            breadcrumbName: "Organization Projects",
        },

    ];

    return (
        <div style={{ width: "100%" }}>
            {organizationName == null ? <Redirect to="/profile/organizations" /> : <div />}
            <PageHeader
                style={{
                    border: "1px solid rgb(235, 237, 240)",
                    backgroundColor: "#FFFFFF",
                }}
                title={"Personal Projects"}
                breadcrumb={{ routes }}
            >
                <Paragraph>These project are yet to be submitted to the organization, please select a project and add your modules to it. When you're happy with the project you can send it in for submission</Paragraph>
            </PageHeader>
            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    background: "#fff",
                    minHeight: 280,
                }}
            ><Row style={{ marginTop: 5 }} gutter={[24, 24]}>
                    {projects.map((project) => (
                        <Col xs={24} lg={8} xl={6} key={project.id}>
                            {/* Redirects user when a project card has been selected */}
                            {selectedCard !== null ? (
                                <Redirect to={"/organization/pre-submission-overview/" + organizationName + "/" + selectedCard} />
                            ) : (
                                <div />
                            )}
                            <Card
                                className="org-project-card"
                                hoverable
                                style={{ width: 240, height: 330 }}
                                onClick={() => {
                                    sessionStorage.setItem("selectedProjectName", project.name);
                                    sessionStorage.setItem("selectedProjectId", project.id);
                                    setSelectedCard(project.id);
                                }}

                                cover={
                                    <img
                                        alt="project"
                                        src={"https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png"}
                                    />
                                }
                            >
                                <Meta
                                    title={project.name}
                                    description={
                                        <Paragraph ellipsis={{ rows: 3 }}>{project.description}</Paragraph>
                                    }
                                />
                                <div
                                    style={{
                                        left: 0,
                                        bottom: 0,
                                        width: "100%",
                                        position: "absolute",
                                    }}
                                >
                                    <Paragraph
                                        style={{
                                            color: "#878787",
                                            marginTop: 20,
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            width: "100%",
                                            textAlign: "center",
                                        }}
                                    >
                                        Last updated {Moment(project.lastUpdated).format('DD/MM/yyyy')}
                                    </Paragraph>
                                    <div
                                        style={{
                                            marginTop: -10,
                                            marginRight: "auto",
                                            marginBottom: 10,
                                            marginLeft: "auto",
                                            textAlign: "center",
                                        }}
                                    >
                                        {project.tags.length > 1 ? (
                                            <Paragraph ellipsis={{ rows: 1 }}>
                                                {project.tags.split(",", 3).map((tag) => (
                                                    <span key={tag} style={{ display: "inline-block" }}>
														<Tag color="blue">{tag}</Tag>
													</span>
                                                ))}
                                            </Paragraph>
                                        ) : (
                                            <div />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
        </div>
    );
}

export default OrgPersonalProject;
