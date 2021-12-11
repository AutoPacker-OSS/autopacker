// Ant Design imports
import { Button, Col, Row, Typography, Form, Spin, Card, Input, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
// Import styles
import './BannerStyle.scss';
// custom alert
import { createAlert } from '../../store/actions/generalActions';
import { deleteCookie, getCookie } from '../../util/cookieService';
import { connect } from 'react-redux';
import axios from 'axios';
// Import custom hooks
import useDebounce from './../../hooks/useDebounce';

// TODO This class should use the banner animation stuff

/**
 * Represents the banner that is presented once user
 * visits the homepage
 */
function Banner({ onRegistrationSuccess, onAuth }) {
  // State
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // Validation
  const [validUsername, setValidUsername] = React.useState('');
  const [usernameHelpText, setUsernameHelpText] = React.useState('');
  const [validEmail, setValidEmail] = React.useState('');
  const [emailHelpText, setEmailHelpText] = React.useState('');
  const [validPassword, setValidPassword] = React.useState('');
  // Get antd sub components
  const { Title, Paragraph } = Typography;

  const debouncedUsernameCheck = useDebounce(username, 500);
  const debouncedEmailCheck = useDebounce(email, 500);

  // Inspired from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedUsernameCheck) {
        if (username.length >= 4) {
          const url =
            process.env.REACT_APP_APPLICATION_URL +
            process.env.REACT_APP_API +
            '/auth/usernameAvailability/' +
            username;

          axios
            .get(url)
            .then((response) => {
              setValidUsername('success');
              setUsernameHelpText('');
            })
            .catch((err) => {
              setValidUsername('error');
              setUsernameHelpText('Username already taken.');
            });
        } else {
          setValidUsername('error');
          setUsernameHelpText('Username needs to be at least 4 characters.');
        }
      } else {
        setValidUsername('');
        setUsernameHelpText('');
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedUsernameCheck],
  );

  // Inspired from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedEmailCheck) {
        if (
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email,
          )
        ) {
          const url =
            process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/auth/emailAvailability/' + email;

          axios
            .get(url)
            .then((response) => {
              setValidEmail('success');
              setEmailHelpText('');
            })
            .catch((err) => {
              setValidEmail('error');
              setEmailHelpText('Email already in use.');
            });
        } else {
          setValidEmail('error');
          setEmailHelpText('Email is not valid.');
        }
      } else {
        setValidEmail('');
        setEmailHelpText('');
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedEmailCheck],
  );

  const text = (
    <div>
      A verification email has been sent to {email} It may take a few minutes. Follow the directions in the email to
      confirm and complete your account. Didn't get the email?{' '}
      <Button
        style={{ padding: 0 }}
        type="link"
        onClick={() => {
          const url =
            process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/auth/resendVerificationToken';

          axios
            .get(url)
            .then((response) => {
              onRegistrationSuccess(
                'New verification token sent',
                'Successfully sent a new verification token. Please check your inbox for a new verification email.',
                'success',
                true,
              );
            })
            .catch((error) => {
              onRegistrationSuccess(
                'Request failed',
                'Could not request a new verification token. Try again later or contact support here: contact@autopacker.no',
                'error',
                true,
              );
            });
        }}>
        Click here to resend
      </Button>
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    deleteCookie('Authorization');
    if (username.trim().length === 0) {
      setValidUsername('error');
      setUsernameHelpText('Please fill in username');
    }
    if (email.trim().length === 0) {
      setValidEmail('error');
      setEmailHelpText('Please fill in email');
    }
    if (password.trim().length === 0) {
      setValidPassword('error');
    }

    if (validUsername === 'success' && validEmail === 'success' && validPassword === 'success') {
      setLoading(true);
      const url = process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/auth/register';

      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      })
        .then((response) => {
          // TODO Check if status is 200 or not and respond corresponding

          setLoading(false);
          if (response.status === 200 || response.status === 201) {
            message.success('Registration success! Check your email inbox.');
            setUsername('');
            setEmail('');
            setPassword('');
          } else {
            message.error("Couldn't register user");
          }
        })
        .catch((error) => {
          console.error(error);
          message.error("Couldn't register user");
        });
    }
  };

  const validatePassword = (value) => {
    setPassword(value);
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)) {
      setValidPassword('success');
    } else if (value.trim().length === 0) {
      setValidPassword('');
    } else {
      setValidPassword('error');
    }
  };

  return (
    <Row className="banner" type="flex" align="middle">
      <Col span={16} offset={4}>
        <Row gutter={[48, 0]}>
          <div style={{}} className="banner-content-wrapper">
            {/* Text Section */}
            <Col xs={24} md={12} style={{ textAlign: 'center', alignSelf: 'center' }}>
              <Title style={{ fontSize: 40, fontWeight: 'bold' }}>Automatic packaging and deployment solution</Title>
              <Paragraph style={{ fontSize: 18, fontWeight: 500 }}>
                Using AutoPacker, you can use any cloud service provider you want and upload, share and test different
                types of projects with an easy-to-use platform.
              </Paragraph>
            </Col>

            {/* Registration form */}
            <Col xs={24} md={12} style={{ textAlign: 'center' }}>
              <Spin spinning={loading} delay={500}>
                <Card size="small" className="login-form">
                  <Form>
                    <Form.Item className="form-item" hasFeedback validateStatus={validUsername} help={usernameHelpText}>
                      <Input
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                        onChange={(e) => {
                          setValidUsername('validating');
                          setUsernameHelpText('Checking username...');
                          setUsername(e.target.value.trim());
                        }}
                        value={username}
                      />
                    </Form.Item>
                    <Form.Item className="form-item" hasFeedback validateStatus={validEmail} help={emailHelpText}>
                      <Input
                        prefix={
                          <MailOutlined
                            style={{
                              color: 'rgba(0,0,0,.25)',
                            }}
                          />
                        }
                        placeholder="Email"
                        onChange={(e) => {
                          setValidEmail('validating');
                          setEmailHelpText('Checking email...');
                          setEmail(e.target.value.trim());
                        }}
                        value={email}
                      />
                    </Form.Item>
                    <div>
                      <Form.Item className="form-item" hasFeedback validateStatus={validPassword}>
                        <Input
                          prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                          placeholder="password"
                          type="password"
                          onChange={(e) => {
                            setValidPassword('validating');
                            validatePassword(e.target.value);
                          }}
                          value={password}
                        />
                      </Form.Item>

                      <p style={{ lineHeight: 1.5, marginBottom: 0, marginTop: 10 }}>
                        Make sure the password is at least {/* TODO Set conditional coloring */}
                        <span
                          style={{
                            color: validPassword === 'success' ? 'green' : 'red',
                          }}>
                          8 characters long, including a number and one lower- and uppercase letter
                        </span>
                      </p>
                    </div>

                    <Form.Item style={{ marginTop: 10, marginBottom: 10 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        onClick={(e) => handleSubmit(e)}>
                        Sign Up
                      </Button>
                      {/* <Paragraph style={{ lineHeight: 1.5, marginTop: 10 }}>
												By clicking "Sign Up", you agree to our{" "}
											</Paragraph> */}
                    </Form.Item>
                  </Form>
                </Card>
              </Spin>
            </Col>
          </div>
        </Row>
      </Col>
    </Row>
  );
}

// Mapping dispatch actions to props to use within the component
const mapDispatchToProps = (dispatch) => {
  return {
    onRegistrationSuccess: async (title, desc, type, isClosable) =>
      dispatch(createAlert(title, desc, type, isClosable)),
  };
};

export default connect(null, mapDispatchToProps)(Banner);
