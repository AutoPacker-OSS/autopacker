import { Layout, PageHeader, Table, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Members() {
  // State
  const [members, setMembers] = React.useState([]);

  const { organizationName } = useParams();

  // Import sub components from antd
  const { Paragraph } = Typography;
  const { Content } = Layout;

  // useEffect(() => {
  // 	axios({
  // 		method: "get",
  // 		url:
  // 			process.env.REACT_APP_APPLICATION_URL +
  // 			process.env.REACT_APP_API +
  // 			"/organization/" +
  // 			organizationName +
  // 			"/members",
  // 		headers: {
  // 			Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
  // 		},
  // 	}).then(function (response) {
  // 		let arr = [];
  // 		let memberNr = 0;
  // 		response.data.forEach((member) => {
  // 			arr.push({
  // 				key: ++memberNr,
  // 				username: member.username,
  // 				role: member.role,
  // 			});
  // 		});
  // 		setMembers(arr);
  // 	});

  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const routes = [
    {
      path: 'organization/dashboard',
      breadcrumbName: 'Dashboard',
    },
    {
      path: 'organization/members',
      breadcrumbName: 'Organization Members',
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      filterMultiple: false,
      // Sort alphabetically
      sorter: (a, b) => b.username.localeCompare(a.username),
      sortDirections: ['descend', 'ascend'],
    },
    /* 		{
			title: "Real name",
			dataIndex: "name",
			filterMultiple: false,
			// Sort alphabetically
			sorter: (a, b) => b.name.localeCompare(a.name),
			sortDirections: ["descend", "ascend"],
		}, */
    {
      title: 'Role',
      dataIndex: 'role',
      filterMultiple: false,
      // Sort alphabetically
      sorter: (a, b) => b.role.localeCompare(a.role),
      sortDirections: ['descend', 'ascend'],
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          backgroundColor: '#FFFFFF',
        }}
        title={organizationName + ' Members'}
        breadcrumb={{ routes }}>
        <Paragraph>Table containing all the members affiliated with the organization in some way.</Paragraph>
      </PageHeader>
      {/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
        }}>
        <Table columns={columns} dataSource={members} />
      </Content>
    </div>
  );
}

export default Members;
