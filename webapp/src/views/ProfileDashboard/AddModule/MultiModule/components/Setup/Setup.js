import { Form, Input, Typography } from 'antd';
import React from 'react';
import Application from './components/Application/Application';
// Import custom components
import Database from './components/Database/Database';

function Setup(props) {
  // State (This needs to be returned to parent when clicking next)
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');

  // Get methods & values from props
  const { prevStep, nextStep, setModuleSpec } = props.methods;
  const { selectedType } = props.values;

  // Import sub components from antd
  const { TextArea } = Input;
  const { Paragraph } = Typography;

  const getType = () => {
    switch (selectedType) {
      case 'database':
        return <Database values={{ name, desc, selectedType }} methods={{ setModuleSpec, prevStep, nextStep }} />;

      case 'application':
        return <Application values={{ name, desc, selectedType }} methods={{ setModuleSpec, prevStep, nextStep }} />;

      default:
        break;
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <div>
      <Paragraph
        style={{
          marginTop: 30,
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 400,
          textAlign: 'center',
        }}>
        General Information
      </Paragraph>
      <Form {...formItemLayout}>
        <Form.Item
          label="Module name"
          style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
          rules={[
            {
              required: true,
              message: 'Please name your module',
            },
          ]}>
          <Input onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Module Description" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}>
          <TextArea onChange={(e) => setDesc(e.target.value)} />
        </Form.Item>
      </Form>
      {getType()}
    </div>
  );
}

export default Setup;
