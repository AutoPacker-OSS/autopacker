import { Button, Col, Form, Input, Layout, PageHeader, Radio, Row, Tag, Tooltip, Typography } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { createAlert, selectMenuOption } from '../../../store/actions/generalActions';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import { breadcrumbItemRender } from '../../../util/breadcrumbItemRender';
import { QuestionCircleOutlined } from '@ant-design/icons';

function NewOrgProject() {
  const [orgProjectName, setOrgProjectName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [links, setLinks] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  //Search for users
  const [usersList, setUsersList] = React.useState([]);
  const [authors, setAuthors] = React.useState([]);

  // Controller state
  const [tagInput, setTagInput] = React.useState('');

  // Conditional state
  const [redirect, setRedirect] = React.useState(false);

  // validation
  const [validName, setValidName] = React.useState(false);
  const [nameValidStatus, setNameValidStatus] = React.useState('');
  const [nameHelpText, setNameHelpText] = React.useState('');

  // Import sub components from antd
  const { TextArea, Search } = Input;
  const { Content } = Layout;
  const { Paragraph, Text } = Typography;

  const { authState } = useOktaAuth();

  const dispatch = useDispatch();

  const { organizationName } = useParams();

  const removeTag = (removedTag) => {
    const tagsa = tags.filter((tag) => tag !== removedTag);
    setTags(tagsa);
  };

  const removeUser = (removeUser) => {
    const u = authors.filter((users) => users !== removeUser);
    setAuthors(u);
  };

  const handleUserSelection = (value) => {
    let u = authors;
    if (authors.indexOf(value) === -1) {
      u = [...authors, value];
      setAuthors(u);
    }
  };

  const handleTagInputConfirm = () => {
    let tagsa = tags;
    if (tagsa.indexOf(tagInput) === -1) {
      tagsa = [...tags, tagInput];
    }
    setTags(tagsa);
    setTagInput('');
  };

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
      path: 'organization/dashboard',
      breadcrumbName: 'Dashboard',
    },
    {
      path: 'organization/create-project',
      breadcrumbName: 'Create Organization Project',
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(desc);
    if (keycloak.idTokenParsed.email_verified) {
      axios({
        method: 'post',
        url: process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/organization/createProject',
        headers: {
          Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
        },
        data: {
          organizationName: organizationName,
          user: keycloak.idTokenParsed.preferred_username,
          authors: authors,
          name: orgProjectName,
          desc: desc,
          links: links,
          tags: tags,
        },
      })
        .then(function () {
          dispatch(
            createAlert(
              'Project Request Submitted',
              'You have successfully submitted a project. You will receive a notification on email when the request has been handled.',
              'success',
              true,
            ),
          );
          dispatch(selectMenuOption('9'));
          setRedirect(true);
        })
        .catch(() => {
          dispatch(
            createAlert(
              'Project Request Failed',
              'Something went wrong while trying to submit the project. There might be an existing project with the specified name',
              'error',
              true,
            ),
          );
        });
    } else {
      dispatch(
        createAlert(
          'Project submission failed',
          "You can't submit a project without verifying your account. Please check your email inbox for a verification email, and follow the instructions.",
          'warning',
          true,
        ),
      );
    }
  };

  const validateName = (value) => {
    if (value.trim().length <= 0) {
      setValidName(false);
      setNameValidStatus('error');
      setNameHelpText('Please name your project');
    } else if (/^[a-zA-Z0-9-]+$/.test(value)) {
      setValidName(true);
      setNameValidStatus('success');
      setNameHelpText('');
    } else {
      setValidName(false);
      setNameValidStatus('error');
      setNameHelpText('Only letters, numbers and dashes are allowed. Spaces and special characters not allowed');
    }
    setOrgProjectName(value);
  };

  const handleSearch = (search) => {
    /* Fetch Users */
    const usersUrl = process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/auth/search?q=' + search;
    axios.get(usersUrl).then((response) => {
      setUsersList(response.data);
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          backgroundColor: '#FFFFFF',
        }}
        title="Create New Project"
        breadcrumb={{ routes: routes, itemRender: breadcrumbItemRender }}>
        <Paragraph>Fill in the form below to create a new project for {organizationName}</Paragraph>
      </PageHeader>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
        }}>
        {redirect ? <Redirect to={'/organization/pre-submission/' + organizationName} /> : <div />}
        <Form {...formItemLayout}>
          <Form.Item
            name="projectName"
            label="Project Name"
            hasFeedback
            validateStatus={nameValidStatus}
            help={nameHelpText}
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
            rules={[
              {
                required: true,
              },
            ]}>
            <Input onChange={(e) => validateName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Description&nbsp;
                <Tooltip
                  title="Please fill out a detailed description of your project. When an owner of the organization review your project
								this can be a critical factor to get the project accepted.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
            rules={[
              {
                required: true,
              },
            ]}>
            <TextArea id="org-project-description" onChange={(e) => setDesc(e.target.value)} />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Website&nbsp;
                <Tooltip title="You can link a website affiliated with your project. This can be GitHub link, hosted website link etc.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}>
            <Input onChange={(e) => setLinks(e.target.value)} />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Tags&nbsp;
                <Tooltip title="Tags can be used to identify and search for projects">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}>
            <Input
              placeholder='Press "ENTER" to add tag'
              id="org-project-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={handleTagInputConfirm}
            />
          </Form.Item>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            <TweenOneGroup
              enter={{
                scale: 0.8,
                opacity: 0,
                type: 'from',
                duration: 100,
                onComplete: (e) => {
                  e.target.style = '';
                },
              }}
              leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
              appear={false}>
              {tags.map((tag) => (
                <span key={tag} style={{ display: 'inline-block' }}>
                  <Tag
                    color="blue"
                    closable
                    onClose={(e) => {
                      e.preventDefault();
                      removeTag(tag);
                    }}>
                    {tag}
                  </Tag>
                </span>
              ))}
            </TweenOneGroup>
          </div>
          <Form.Item
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
            label={
              <span>
                Author&nbsp;
                <Tooltip title="Search for user(s) that worked on this project with you and click on user(s) to add them as a author">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }>
            <Search placeholder="Search..." onChange={(e) => handleSearch(e.target.value)} />
            {usersList.length <= 0 ? (
              <p>No users found</p>
            ) : (
              <Row gutter={[0, 1]}>
                {usersList.slice(0, 4).map((usersList) => (
                  <Col key={usersList.id} span={12}>
                    <Text
                      strong
                      style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                      onClick={() => handleUserSelection(usersList.username)}>
                      {usersList.username}
                    </Text>
                  </Col>
                ))}
              </Row>
            )}
          </Form.Item>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            <TweenOneGroup
              enter={{
                scale: 1,
                opacity: 0,
                type: 'from',
                duration: 100,
                onComplete: (e) => {
                  e.target.style = '';
                },
              }}
              leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
              appear={false}>
              {authors.map((user) => (
                <span key={user} style={{ display: 'inline-block' }}>
                  <Tag
                    color="green"
                    closable
                    onClose={(e) => {
                      e.preventDefault();
                      removeUser(user);
                    }}>
                    {user}
                  </Tag>
                </span>
              ))}
            </TweenOneGroup>
          </div>
          <Form.Item
            name="privateProject"
            label={
              <span>
                Private project&nbsp;
                <Tooltip title="Private means only you can access. Public means everyone can access (currently only public projects available)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
            rules={[
              {
                required: true,
              },
            ]}>
            <Radio.Group value="no">
              <Radio
                disabled
                value="yes"
                onChange={() => {
                  //RadioChecked(true);
                  //setPrivate(true);
                }}>
                Yes
              </Radio>
              <Radio
                value="no"
                onChange={() => {
                  //	setRadioChecked(true);
                  //	setPrivate(false);
                }}>
                No
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={'Additional Info'} style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}>
            <TextArea id="org-project-comment" />
          </Form.Item>

          <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => handleSubmit(e)}>
            <Button id="create-org-project-btn" disabled={!validName || desc.trim().length <= 0} type="primary">
              Create Project
            </Button>
          </div>
        </Form>
      </Content>
    </div>
  );
}

export default NewOrgProject;
