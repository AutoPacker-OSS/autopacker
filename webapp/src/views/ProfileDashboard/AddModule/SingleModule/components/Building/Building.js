import { LoadingOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';

function Building(props) {
  // Get methods from props
  const { nextStep, setUploadSuccess } = props.methods;

  // Get value from props
  const { setupInfo, file } = props.values;

  const { user } = useAuth0();

  const projectName = sessionStorage.getItem('selectedProjectName');

  useEffect(() => {
  	const requestUrl = `/projects/${user.username}/${projectName}/${setupInfo.name}/add`;

  	let formData = new FormData();
  	formData.append("desc", setupInfo.desc);
  	formData.append("config-type", setupInfo["config-type"]);
  	formData.append("config-params", '{ "port": ' + setupInfo.port + " }");
  	formData.append("module-file", file[0]);

  	// TODO Change this to use the useAPI when ready
  	fetch(requestUrl, {
  		method: "POST",
  		headers: {
  			// Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
  		},
  		body: formData,
  	})
  		.then((response) => {
  			if (response.status === 200 || response.status === 201) {
  				setUploadSuccess(true);
  			} else {
  				setUploadSuccess(false);
  			}
  			nextStep();
  		})
  		.catch(() => {
  			nextStep();
  			setUploadSuccess(false);
  		});
  }, []);

  // TODO Extract into own UserContext, similar to the one we had earlier. hehe
  // useEffect(() => {
  // 	const getUserMetadata = async () => {
  // 		const domain = "YOUR_DOMAIN";

  // 		try {
  // 			const accessToken = await getAccessTokenSilently({
  // 				audience: `https://${domain}/api/v2/`,
  // 				scope: "read:current_user",
  // 			});

  // 			const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

  // 			const metadataResponse = await fetch(userDetailsByIdUrl, {
  // 				headers: {
  // 					Authorization: `Bearer ${accessToken}`,
  // 				},
  // 			});

  // 			const { user_metadata } = await metadataResponse.json();

  // 			setUserMetadata(user_metadata);
  // 		} catch (e) {
  // 			console.log(e.message);
  // 		}
  // 	};

  // 	getUserMetadata();
  // }, [getAccessTokenSilently, user?.sub]);

  return (
    <div>
      <Row>
        <Col xs={24}>
          <Spin
            style={{
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 30,
              marginBottom: 30,
            }}
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Building;
