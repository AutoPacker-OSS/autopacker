import { Carousel, Col, Layout, Row, Typography } from 'antd';
import React from 'react';
import Banner from '../../components/Banner/Banner';
// Components
import Navbar from '../../components/Navbar/Navbar';
// Import styles
import './HomeStyle.scss';

// Images
import UserProjectsImage from '../../assets/webpage/user_projects.png';
import UserServersImage from '../../assets/webpage/user_servers.png';
import ModuleUploadImage from '../../assets/webpage/module_upload.png';
import OrganizationProjectsImage from '../../assets/webpage/organization_projects.png';
import OrganizationSubmissionImage from '../../assets/webpage/submit_project.png';
import { BuildOutlined, CloudOutlined, HddOutlined } from '@ant-design/icons';

/**
 * Is the first view the user sees when entering the page (unauthenticated)
 */
function Home() {
  // Get antd sub components
  const { Title, Paragraph } = Typography;

  return (
    <React.Fragment>
      <Layout>
        {/* Navigation bar */}
        <Navbar />
        {/* Banner */}
        <Banner />
        {/* Information section */}
        <Row style={{ paddingTop: 60, paddingBottom: 40, backgroundColor: 'white' }} type="flex" justify="center">
          <Col xs={20}>
            <Row type="flex" justify="center">
              <Col style={{ textAlign: 'center' }} xs={24}>
                <Title>What is AutoPacker?</Title>
              </Col>
            </Row>
            <Row
              style={{
                marginTop: 20,
                maxWidth: 1200,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              gutter={[24, 0]}>
              <Col xs={24} md={8}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  <div
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      textAlign: 'center',
                    }}>
                    <BuildOutlined
                      style={{
                        fontSize: 64,
                        marginBottom: 10,
                        color: '#7795ff',
                      }}
                      theme="filled"
                    />
                  </div>
                  <Title
                    style={{
                      textAlign: 'center',
                    }}
                    level={3}>
                    Building
                  </Title>
                  <Paragraph style={{ fontSize: 16, textAlign: 'center' }}>
                    AutoPacker will automatically build your projects and modules using an easy-to-use wizard for
                    finding out your requirements.
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  <div
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      textAlign: 'center',
                    }}>
                    <CloudOutlined
                      style={{
                        fontSize: 64,
                        marginBottom: 10,
                        color: '#7795ff',
                      }}
                      theme="filled"
                    />
                  </div>
                  <Title
                    style={{
                      textAlign: 'center',
                    }}
                    level={3}>
                    Deployment
                  </Title>
                  <Paragraph style={{ fontSize: 16, textAlign: 'center' }}>
                    AutoPacker will use the servers you provide to deploy your uploaded projects automatically. This is
                    especially useful for students who have virtual machines provided by their schools.
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  <div
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      textAlign: 'center',
                    }}>
                    <HddOutlined
                      style={{
                        fontSize: 64,
                        marginBottom: 10,
                        color: '#7795ff',
                      }}
                      theme="filled"
                    />
                  </div>
                  <Title
                    style={{
                      textAlign: 'center',
                    }}
                    level={3}>
                    Virtualization
                  </Title>
                  <Paragraph style={{ fontSize: 16, textAlign: 'center' }}>
                    By using virtualization technology, AutoPacker can bundle your software into operating system
                    independent packages that can run on any host.
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ paddingTop: 60, paddingBottom: 40, backgroundColor: '#e7ebfe' }} type="flex" justify="center">
          <Col xs={20}>
            <Row type="flex" justify="center">
              <Col style={{ textAlign: 'center' }} xs={24}>
                <Title>Built for students & universities</Title>
                <Paragraph
                  style={{
                    fontSize: 16,
                    maxWidth: 800,
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  AutoPacker is a bachelor project created with universities and students in mind. Both universities and
                  students can use the platform for storing, hosting, and sharing bachelor projects, lectures, tools and
                  other software using a modern platform with multiple wizards to help.
                </Paragraph>
                <Carousel
                  autoplay
                  style={{
                    width: '100%',
                    height: 450,
                    borderRadius: 10,
                    marginTop: 40,
                    marginBottom: 40,
                    maxWidth: 800,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  className="carousel-shadow">
                  <div>
                    <img
                      style={{ width: '100%', height: 450, borderRadius: 10 }}
                      src={UserProjectsImage}
                      alt="User Projects"
                    />
                  </div>
                  <div>
                    <img
                      style={{ width: '100%', height: 450, borderRadius: 10 }}
                      src={UserServersImage}
                      alt="User Servers"
                    />
                  </div>
                  <div>
                    <img
                      style={{ width: '100%', height: 450, borderRadius: 10 }}
                      src={ModuleUploadImage}
                      alt="Module Upload"
                    />
                  </div>
                  <div>
                    <img
                      style={{ width: '100%', height: 450, borderRadius: 10 }}
                      src={OrganizationProjectsImage}
                      alt="Organization"
                    />
                  </div>
                  <div>
                    <img
                      style={{ width: '100%', height: 450, borderRadius: 10 }}
                      src={OrganizationSubmissionImage}
                      alt="Organization - Submitting a project"
                    />
                  </div>
                </Carousel>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* Technology section */}
        {/* <Row style={{ marginBottom: 40 }} type="flex" justify="center">
					<Col xs={20}>
						<Row type="flex" justify="center">
							<Col style={{ textAlign: "center" }} xs={24}>
								<Title style={{ marginBottom: 10 }}>Technologies</Title>
							</Col>
						</Row>
						<Row gutter={[24, 0]}>
							<Carousel autoplay dots={false}>
								{/* First slide 
								<div>
									<Row type="flex" justify="center">
										<Col style={{ textAlign: "center" }} xs={24}>
											<Title level={4}>Frontend</Title>
										</Col>
									</Row>
									<Row type="flex" justify="center" style>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="gitlab" />
										</Col>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="gitlab" />
										</Col>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="gitlab" />
										</Col>
									</Row>
									<Row type="flex" justify="center" style>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="gitlab" />
										</Col>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="gitlab" />
										</Col>
									</Row>
								</div>
								{/* Second slide }
								<div>
									<Row type="flex" justify="center">
										<Col style={{ textAlign: "center" }} xs={24}>
											<Title level={4}>Backend</Title>
										</Col>
									</Row>
									<Row type="flex" justify="center" style>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="github" />
										</Col>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="github" />
										</Col>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="github" />
										</Col>
									</Row>
									<Row type="flex" justify="center" style>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="github" />
										</Col>
										<Col xs={4} style={{ textAlign: "center" }}>
											<Icon style={{ fontSize: 48 }} type="github" />
										</Col>
									</Row>
								</div>
							</Carousel>
						</Row>
					</Col>
				</Row> */}
        {/* Who's using AutoDeploy section */}
        {/* <Row className="whos-using-row" type="flex" justify="center">
					<Col xs={20}>
						<Row type="flex" justify="center">
							<Col style={{ textAlign: "center" }} xs={24}>
								<Title style={{ color: "white" }}>Who's using AutoPacker?</Title>
							</Col>
						</Row>
						<WhosUsing />
					</Col>
				</Row> */}

        {/* Contact */}
        {/* <Contact /> */}

        {/* Footer */}
        <Row style={{ backgroundColor: 'white' }}>
          <Col xs={24} style={{ marginTop: 25, marginBottom: 13 }}>
            <p style={{ textAlign: 'center' }}>
              {'Copyright © '}
              AutoPacker
              {' ' + new Date().getFullYear()}
              {' - '}Made by students at NTNU Ålesund as part of their bachelor project
            </p>
          </Col>
        </Row>
      </Layout>
    </React.Fragment>
  );
}

export default Home;
