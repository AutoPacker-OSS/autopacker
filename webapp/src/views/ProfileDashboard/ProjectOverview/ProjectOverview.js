import { Button, Card, Col, Empty, Layout, Modal, PageHeader, Row, Tag, Typography } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import { createAlert } from '../../../store/actions/generalActions';
import { breadcrumbItemRender } from '../../../util/breadcrumbItemRender';
import { GlobalOutlined, PlusCircleOutlined, SettingOutlined, GitlabOutlined, DeleteOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import Moment from 'moment';
import { useApi } from '../../../hooks/useApi';
import { useAuth0 } from '@auth0/auth0-react';

function ProjectOverview() {
  // State
  const [project, setProject] = React.useState({});
  const [projectModules, setProjectModules] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedModule, setSelectedModule] = React.useState(null);
  const [moduleToDeleteSelected, setModuleToDeleteSelected] = React.useState(null);

  const [refreshList, setRefreshList] = React.useState(false);

  // Get antd sub components
  const { Paragraph } = Typography;
  const { Content } = Layout;
  const { Meta } = Card;

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { get } = useApi();

  const projectName = sessionStorage.getItem('selectedProjectName');

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedModule(null);
    get(`/projects/${user.username}/${projectName}`).then((resp) => {
      setProject(resp.data);
      if (resp.data.tags) {
        setTags(resp.data.tags.split(','));
      } else {
        setTags([]);
      }
      setProjectModules(resp.data.modules);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshList]);

  const routes = [
    {
      path: '/profile',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '/projects',
      breadcrumbName: 'Your Projects',
    },
    {
      path: `/overview/${project.id}`,
      breadcrumbName: project.name,
    },
  ];

  const title = (
    <div>
      {project.name}
      <GlobalOutlined style={{ marginLeft: 20 }} />
      {project.private ? ' Private' : ' Public'}
    </div>
  );

  const selectModalToDelete = (id, name) => {
    setModuleToDeleteSelected({
      id: id,
      name: name,
    });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setModuleToDeleteSelected(null);
  };

  // const deleteModal = () => {
  // 	axios({
  // 		method: "delete",
  // 		url:
  // 			process.env.REACT_APP_APPLICATION_URL +
  // 			process.env.REACT_APP_API +
  // 			"/projects/" +
  // 			user.username +
  // 			"/" +
  // 			projectName +
  // 			"/" +
  // 			moduleToDeleteSelected.name,
  // 		headers: {
  // 			Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
  // 		},
  // 	})
  // 		.then(() => {
  // 			dispatch(
  // 				createAlert(
  // 					"Module successfully deleted",
  // 					"You have successfully deleted the module: " + moduleToDeleteSelected.name,
  // 					"success",
  // 					true
  // 				)
  // 			);
  // 			setRefreshList(!refreshList);
  // 			closeDeleteModal();
  // 		})
  // 		.catch(() => {
  // 			dispatch(
  // 				createAlert(
  // 					"Failed to delete module",
  // 					"Failed to delete the module: " +
  // 						moduleToDeleteSelected.name +
  // 						". Please write an issue on GitHub if this is unresolved",
  // 					"error",
  // 					true
  // 				)
  // 			);
  // 			closeDeleteModal();
  // 		});
  // };

  return (
    <div style={{ width: '100%', height: 'auto' }}>
      {projectName === null ? <Navigate to="/profile/projects" /> : <div />}
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          backgroundColor: '#FFFFFF',
          paddingBottom: 50,
        }}
        title={title}
        breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}
        extra={[
          <Link key={0} style={{ marginLeft: 10, marginRight: 10 }} to="/profile/projects/add-module">
            <Button type="link">
              <PlusCircleOutlined /> Add Module
            </Button>
          </Link>,
          /*<Link key={1} style={{ marginLeft: 10, marginRight: 10 }} to="#">
						<Icon type="download" /> Download
					</Link>,*/
          <Link
            id="project-settings-link"
            key={2}
            style={{ marginLeft: 10, marginRight: 10 }}
            to={'/profile/projects/overview/' + project.name + '/settings'}>
            <SettingOutlined /> Settings
          </Link>,
        ]}>
        <Paragraph>{project.description}</Paragraph>
        <Paragraph style={{ color: 'blue' }}>
          {project.website !== '' ? (
            <a href={project.website} target="_blank" rel="noopener noreferrer">
              <GitlabOutlined /> {project.website}
            </a>
          ) : (
            <div />
          )}
        </Paragraph>
        <div>
          <div style={{ float: 'left' }}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} style={{ display: 'inline-block' }}>
                  <Tag color="blue">{tag}</Tag>
                </span>
              ))
            ) : (
              <div />
            )}
          </div>
          <Paragraph style={{ float: 'right' }}>
            Last updated {Moment(project.lastUpdated).format('DD/MM/yyyy')}
          </Paragraph>
        </div>
      </PageHeader>
      {/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
        }}>
        {projectModules.length > 0 ? (
          <Row gutter={[24, 24]}>
            {projectModules.map((module) => (
              <Col xs={24} lg={8} xl={6} key={module.id}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  bodyStyle={{ padding: 0 }}
                  actions={[
                    /*<Icon
											type="download"
											key="download"
											onClick={() => message.success("Download button hit")}
										/>,
										<Icon
											type="edit"
											key="edit"
											onClick={() => message.success("Edit button hit")}
										/>,*/
                    <DeleteOutlined key="delete" onClick={() => selectModalToDelete(module.id, module.name)} />,
                  ]}>
                  <div
                    onClick={() => {
                      setSelectedModule(module);
                      setModalOpen(true);
                    }}>
                    <img
                      style={{ width: '100%' }}
                      alt="Module"
                      src={
                        'https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png'
                      }
                    />
                    <Meta
                      style={{ padding: 20 }}
                      title={module.name}
                      description={module.desc !== null ? <Paragraph ellipsis>{module.desc}</Paragraph> : <div />}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            imageStyle={{
              height: 150,
            }}
            description="Project contains no modules">
            <Button type="primary">
              <Link to="/profile/projects/add-module">Add Module(s)</Link>
            </Button>
          </Empty>
        )}
        {selectedModule !== null ? (
          <Modal
            title={selectedModule.name}
            centered
            visible={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={[
              <Button key="close" onClick={() => setModalOpen(false)}>
                Close
              </Button>,
            ]}>
            <img
              style={{ width: '100%' }}
              alt="Module"
              src={
                'https://res.cloudinary.com/hkf2ycaep/image/fetch/d_project-placeholder.png,f_auto/https:/assets/project-placeholder-b90804f0a659d3f283c62d185d49635da22a5b8bbfb7e985f0d0390201f9d2b1.png'
              }
            />
            <p style={{ marginTop: 20 }}>{selectedModule.desc}</p>
            {selectedModule.framework !== null ? (
              <p>
                <b>Framework: </b>
                {selectedModule.framework}
              </p>
            ) : (
              <div />
            )}
            <p>
              <b>Language: </b>
              {selectedModule.configType.split('-')[0]} {selectedModule.configType.split('-')[1]}
            </p>
            <p>
              <b>Port: </b>
              {selectedModule.port}
            </p>
            <p>
              <b>Source Code: Not available</b>
              {/* <a
							href={selectedModule.sourceCode}
							rel="noopener noreferrer"
							target="_blank"
						>
							{selectedModule.sourceCode}
						</a> */}
            </p>
          </Modal>
        ) : (
          <div />
        )}
        {/* Delete Modal */}
        {moduleToDeleteSelected !== null ? (
          <Modal
            title={'Delete "' + moduleToDeleteSelected.name + '"?'}
            centered
            visible={deleteModalOpen}
            // TODO FIX THIS :)
            // onOk={() => deleteModal()}
            okText="Yes"
            okType="danger"
            onCancel={() => closeDeleteModal()}>
            <Paragraph>Are you sure you want to delete this module?</Paragraph>
          </Modal>
        ) : (
          <div />
        )}
      </Content>
    </div>
  );
}

export default ProjectOverview;
