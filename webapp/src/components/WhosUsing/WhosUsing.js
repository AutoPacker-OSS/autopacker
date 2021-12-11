import React from 'react';
import { Row, Col } from 'antd';

import './WhosUsingStyle.scss';

/**
 * Contains the information regarding how many users we have,
 * how many organizations uses our service and how many organizational employees
 */
function WhosUsing() {
  return (
    <Row type="flex" justify="center" style={{ textAlign: 'center' }}>
      <Col xs={20} md={6}>
        <h3 className="whos-number">103</h3>
        <p className="whos-text">Members</p>
      </Col>
      <Col xs={20} md={6}>
        <h3 className="whos-number">15</h3>
        <p className="whos-text">Organizational Staff</p>
      </Col>
      <Col xs={20} md={6}>
        <h3 className="whos-number">1</h3>
        <p className="whos-text">Organizations</p>
      </Col>
    </Row>
  );
}

export default WhosUsing;
