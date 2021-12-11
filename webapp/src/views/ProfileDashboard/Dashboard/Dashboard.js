import React from 'react';
import { Layout } from 'antd';
// Import styles
import './DashboardStyle.scss';

function Dashboard() {
  const { Content } = Layout;

  return (
    <Content
      style={{
        margin: '24px 16px',
        padding: 24,
        background: '#fff',
        minHeight: 280,
      }}>
      <React.Fragment>Dashboard is coming</React.Fragment>
    </Content>
  );
}

export default Dashboard;
