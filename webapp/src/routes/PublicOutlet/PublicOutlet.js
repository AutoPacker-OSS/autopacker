import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

function PublicOutlet() {
  // Get antd sub components
  const { Content } = Layout;

  return (
    <Layout>
      {/* Navbar */}
      <Navbar />
      {/* Content */}
      <Content style={{ backgroundColor: 'white' }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default PublicOutlet;
