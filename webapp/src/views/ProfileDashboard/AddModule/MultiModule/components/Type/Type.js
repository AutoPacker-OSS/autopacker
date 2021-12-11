import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import { AppstoreOutlined, DatabaseOutlined } from '@ant-design/icons';

function Type(props) {
  const { setSelectedModuleType, prevStep } = props.methods;

  return (
    <div style={{ width: '100%' }}>
      <Row className="module-wrapper" type="flex" justify="center" gutter={[16]}>
        <Col span={5}>
          <Card
            onClick={() => setSelectedModuleType('application')}
            className="module-card"
            style={{ margin: '0 auto' }}>
            <Row type="flex" justify="center" align="middle">
              <div style={{ textAlign: 'center' }}>
                <Col xs={24}>
                  <AppstoreOutlined style={{ fontSize: 30 }} />
                </Col>
                <Col style={{ fontSize: 20 }} xs={24}>
                  Application
                </Col>
              </div>
            </Row>
          </Card>
        </Col>
        <Col span={5}>
          <Card style={{ margin: '0 auto' }} className="module-card" onClick={() => setSelectedModuleType('database')}>
            <Row type="flex" justify="center" align="middle">
              <div style={{ textAlign: 'center' }}>
                <Col xs={24}>
                  <DatabaseOutlined style={{ fontSize: 30 }} />
                </Col>
                <Col style={{ fontSize: 20 }} xs={24}>
                  Database
                </Col>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type="primary" icon="left" onClick={() => prevStep()}>
            Previous
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Type;
