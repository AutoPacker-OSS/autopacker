import { QuestionCircleOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Col, Form, Input, message, PageHeader, Row, Select, Tooltip, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import NTNU from '../../assets/image/ntnu.png';

function ProfileOrganizationForm() {
  // Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [comment, setComment] = React.useState('');

  const { user } = useAuth0();

  // State
  const [organization, setOrganization] = React.useState({});

  const [redirect, setRedirect] = React.useState(false);

  // Import sub components from antd

  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  useEffect(() => {
    const organizationName = sessionStorage.getItem('selectedPublicOrganization');

    const projectsUrl =
      process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/organization/' + organizationName;

    axios.get(projectsUrl).then((response) => {
      setOrganization(response.data);
    });
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = '/organization/requestMembership';

    axios
      .post(url, {
        organizationName: organization.name,
        username: user.username,
        name: name,
        email: email,
        role: role,
        comment: comment,
      })
      .then(
        () => {
          message.success('Successfully sent the member application');
          setRedirect(true);
        },
        (error) => {
          message.error('Member already exist or you have already sent an application');
          console.error(error);
        },
      );
  };

  return (
    <React.Fragment>
      {redirect ? <Navigate to={'/organization/' + organization.name} /> : <div />}
      {/* Content */}
      <Row
        style={{
          borderTop: '1px solid rgb(235, 237, 240)',
          backgroundColor: '#FFFFFF',
        }}
      />
      <Row style={{ marginTop: 20 }}>
        <Col span={14} offset={5}>
          <Row style={{ maxWidth: 1100 }} gutter={[24, 0]}>
            {/* Profile details */}
            <Col xs={24} md={7}>
              <div style={{ textAlign: 'center' }}>
                <img
                  style={{
                    border: '1px solid black',
                    padding: 5,
                    backgroundColor: 'white',
                  }}
                  className="identicon"
                  src={NTNU}
                  alt="NTNU logo"
                />
                <Title level={4}>{organization.name}</Title>
              </div>
            </Col>
            {/* Profile Content */}
            <Col xs={24} md={17}>
              <PageHeader
                style={{
                  border: '1px solid rgb(235, 237, 240)',
                  backgroundColor: '#FFFFFF',
                }}
                title={organization.name + ' Member Application'}
                onBack={() => window.history.back()}>
                <Paragraph ellipsis={{ rows: 3, expandable: true }}>{organization.description}</Paragraph>
              </PageHeader>
              {/* Application Form */}
              <Form
                {...formItemLayout}
                style={{ marginTop: 20 }}
                initialValues={{
                  ['username']: user.username,
                }}>
                <Form.Item
                  name="username"
                  label={
                    <span>
                      Username&nbsp;
                      <Tooltip title="Your authenticated accounts' username">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: 400,
                  }}
                  rules={[
                    {
                      required: true,
                    },
                  ]}>
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="name"
                  label={
                    <span>
                      Real name&nbsp;
                      <Tooltip title="Is only available for organization admin, and is used for verification. For example a university can verify that you are indeed a real person at the university">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: 400,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your name',
                    },
                  ]}>
                  <Input onChange={(event) => setName(event.target.value)} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={
                    <span>
                      Email&nbsp;
                      <Tooltip title="The email to receive all organization related emails on. This can be the same as your AutoPacker accounts' email">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: 400,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your email',
                    },
                  ]}>
                  <Input onChange={(event) => setEmail(event.target.value)} />
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Role&nbsp;
                      <Tooltip title="Enter the role you wish to have within the organization">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  hasFeedback
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: 400,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Please select a role',
                    },
                  ]}>
                  <Select placeholder="Please select a role" onChange={(value) => setRole(value)}>
                    <Option value="MEMBER">MEMBER</Option>
                    {/* <Option value="MAINTAINER">MAINTAINER</Option>
													<Option value="ADMIN">ADMIN</Option>
													<Option value="EMPLOYEE">EMPLOYEE</Option>*/}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Comment&nbsp;
                      <Tooltip title="Can be anything, why you want the selected role, why you want to join etc.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: 400,
                  }}>
                  <TextArea onChange={(event) => setComment(event.target.value)} />
                </Form.Item>
                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => handleSubmit(e)}>
                  <Button
                    disabled={user.username.length <= 0 || name.length <= 0 || email.length <= 0 || role.length <= 0}
                    type="primary">
                    Submit Form
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default ProfileOrganizationForm;
