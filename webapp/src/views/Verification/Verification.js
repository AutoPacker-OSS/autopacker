import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Result, Button } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
// Custom components
import Navbar from '../../components/Navbar/Navbar';
// Custom alert
import { createAlert } from '../../store/actions/generalActions';

function Verification() {
  const [success, setSuccess] = React.useState(false);
  const [result, setResult] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState(true);
  const [authenticationRedirect, setAuthenticationRedirect] = React.useState(false);
  // Get state from redux store
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const dispatch = useDispatch();

  useEffect(() => {
    let arr = window.location.href.split('?', 2);
    let token = arr[1];

    const url =
      process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/auth/registrationConfirmation?' + token;

    // Perform request
    axios
      .get(url)
      .then(() => {
        if (isAuthenticated) {
          dispatch(
            createAlert(
              'Verification Success!',
              "You are now authorized to use the system to it's full potential. Creating, deploying and sharing projects.",
              'success',
              true,
            ),
          );
          setAuthenticationRedirect(true);
        } else {
          setSuccess(true);
          setResult({
            status: 'success',
            title: 'Verification Success!',
            subTitle:
              "You are now authorized to use the system to it's full potential. Creating, deploying and sharing projects.",
            button: 'Sign in',
          });
        }
      })
      .catch((error) => {
        setSuccess(false);
        setResult({
          status: 'error',
          title: 'Verification Failed',
          subTitle:
            'Your token is either invalid or expired. Please request a new verification token by clicking the button below.',
          button: 'Request new token',
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestNewToken = () => {
    let arr = window.location.href.split('?', 2);
    let token = arr[1];

    const url =
      process.env.REACT_APP_APPLICATION_URL + process.env.REACT_APP_API + '/auth/requestNewVerificationToken?' + token;

    axios
      .get(url)
      .then(() => {
        setSuccess(true);
        setEnableButton(false);
        setResult({
          status: 'success',
          title: 'Request Success',
          subTitle: 'New verification email has been sent to your email. Might take a few minutes.',
          button: 'Sign in',
        });
      })
      .catch(() => {
        setSuccess(false);
        setEnableButton(false);
        setResult({
          status: 'warning',
          title: 'Request Denied',
          subTitle: 'Could not request a new verification email, please contact support. Email: contact@autopacker.no',
          button: 'Sign in',
        });
      });
  };

  return (
    <React.Fragment>
      <Layout>
        {authenticationRedirect ? <Navigate to="/profile/projects" /> : <div />}
        {/* Navigation bar */}
        <Navbar />
        {/* Feedback */}
        <Result
          status={result.status}
          title={result.title}
          subTitle={result.subTitle}
          extra={[
            enableButton ? (
              success ? (
                <Button type="primary" key="console">
                  <Link to="/signin">{result.button}</Link>
                </Button>
              ) : (
                <Button type="primary" key="console" onClick={() => requestNewToken()}>
                  {result.button}
                </Button>
              )
            ) : (
              <div />
            ),
          ]}
        />
      </Layout>
    </React.Fragment>
  );
}

export default Verification;
