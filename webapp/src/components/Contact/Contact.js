import { Button, Col, Form, Input, Row, Select, Typography } from 'antd';
import emailjs from 'emailjs-com';
import React from 'react';
import './ContactStyle.scss';

/**
 * Handles the contact form related functionality at the homepage
 */
function ContactForm() {
  const [newEmail, setNewEmail] = React.useState('');
  const [newSubject, setNewSubject] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [inputValid, setInputValid] = React.useState(false);

  async function handleSubmit(e) {
    if (inputValid) {
      e.preventDefault();

      var templateParams = {
        mail: newEmail,
        subject: newSubject,
        message_html: newMessage,
      };

      // code snippet from https://www.emailjs.com/docs/examples/reactjs/
      emailjs.send('gmail', 'template_2zIyI7xU', templateParams, 'user_QFjWUqwyA9FWwCLehrTZl').then(
        (result) => {},
        (error) => {},
      );

      setNewEmail('');
      setNewSubject('');
      setNewMessage('');
    }
  }

  const handleInputChange = (input, value) => {
    switch (input) {
      case 0:
        setNewEmail(value);
        if (validateEmail(value)) {
          setInputValid(true);
        } else {
          setInputValid(false);
        }
        break;

      case 1:
        setNewSubject(value);
        break;

      case 2:
        setNewMessage(value);
        break;

      default:
    }
  };

  function validateEmail(email) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  const { Title } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;

  return (
    <div className="contactForm">
      <Title level={2} id="title">
        Contact
      </Title>

      <Row>
        <Col span={8} />
        <Col span={8}>
          <Form layout="vertical" onSubmit={handleSubmit}>
            <Form.Item>
              <Input
                type="email"
                placeholder="Email"
                id="email"
                style={{ width: 275 }}
                value={newEmail}
                onChange={(event) => handleInputChange(0, event.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Select
                showSearch
                style={{ width: 275 }}
                placeholder="Category"
                optionFilterProp="children"
                value={newSubject}
                onChange={(value) => handleInputChange(1, value)}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                <Option value="Support">Support</Option>
                <Option value="Technical">Technical</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <TextArea
                id="text-box"
                placeholder="Please describe exactly what the problem is"
                value={newMessage}
                rows={4}
                style={{ width: 450, height: 150 }}
                minLength="10"
                required="required"
                onChange={(event) => handleInputChange(2, event.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: 275 }} onClick={(event) => handleSubmit(event)}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8} />
      </Row>
    </div>
  );
}

export default ContactForm;
