import React from 'react';
import { Typography, Button, Divider } from 'antd';

function AccountSetting() {
  const { Title, Text } = Typography;

  return (
    <div>
      <Title style={{ color: 'red' }} level={2}>
        Delete account
        <Divider style={{ marginTop: 10 }} />
      </Title>
      <Text>
        By deleting your account, you will lose all your personal projects (its modules, data and configuration), server
        setups and you will loose your relation to organizations.
      </Text>
      <br />
      <Button style={{ marginTop: 10 }} type="danger" disabled>
        Delete account
      </Button>{' '}
      (Coming soon)
    </div>
  );
}

export default AccountSetting;
