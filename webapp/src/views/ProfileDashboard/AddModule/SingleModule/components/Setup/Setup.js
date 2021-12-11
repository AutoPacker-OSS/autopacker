import React, { useEffect } from 'react';
import { Button, Form, Input, Radio, Typography } from 'antd';
// Import custom components
import LanguageSelector from './components/LanguageSelector';
import FrameworkSelector from './components/FrameworkSelector';
import { RightOutlined } from '@ant-design/icons';

function Setup(props) {
  // State (This needs to be returned to parent when clicking next)
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [port, setPort] = React.useState('');

  // State passed as props to component
  const [supportedLanguages, setSupportedLanguages] = React.useState([]);
  const [supportedFrameworks, setSupportedFrameworks] = React.useState([]);
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);
  const [selectedVersion, setSelectedVersion] = React.useState(null);

  // Selections
  const [frameworkTouched, setFrameworkTouched] = React.useState(false);
  const [isFramework, setIsFramework] = React.useState(false);

  // validation
  const [validName, setValidName] = React.useState(false);
  const [nameValidStatus, setNameValidStatus] = React.useState('');
  const [nameHelpText, setNameHelpText] = React.useState('');

  // Get methods from props
  const { nextStep, setSetupInfo } = props.methods;

  // Import sub components from antd
  const { TextArea } = Input;
  const { Paragraph } = Typography;

  const handleChange = (input, value) => {
    switch (input) {
      case 0:
        setSelectedLanguage(value);
        break;

      case 1:
        setSelectedVersion(value);
        break;

      default:
        break;
    }
  };

  const handleNext = () => {
    if (!(name.length <= 0 || selectedLanguage === null || selectedVersion === null || port.length < 2)) {
      let form = {
        name: name,
        desc: desc,
        language: selectedLanguage.name,
        version: selectedVersion.version,
        'config-type': selectedVersion['config-type'],
        port: port,
      };
      setSetupInfo(form);
      nextStep();
    }
  };

  useEffect(() => {
    // Create dummy list
    let languages = [
      {
        id: 1,
        name: 'Java',
        versions: [
          {
            id: 1,
            version: '8 jar',
            'config-type': 'java-8-jar',
          },
          {
            id: 2,
            version: '11 jar',
            'config-type': 'java-11-jar',
          },
          {
            id: 3,
            version: '8 project',
            'config-type': 'java-8',
          },
          {
            id: 4,
            version: '11 project',
            'config-type': 'java-11',
          },
        ],
      },
      {
        id: 4,
        name: 'Static HTML, CSS and JS',
        versions: [
          {
            id: 7,
            version: 'standard',
            'config-type': 'staticsite',
          },
        ],
      },
    ];

    let frameworks = [
      {
        id: 2,
        name: 'React',
        versions: [
          {
            id: 5,
            version: 'standard',
            'config-type': 'react',
          },
        ],
      },
      {
        id: 3,
        name: 'Angular',
        versions: [
          {
            id: 6,
            version: 'standard',
            'config-type': 'angular',
          },
        ],
      },
      {
        id: 5,
        name: 'Spring boot',
        versions: [
          {
            id: 8,
            version: 'Java 11',
            'config-type': 'spring-boot',
          },
        ],
      },
    ];

    // Add dummy list to state on mount
    setSupportedLanguages(languages);
    setSupportedFrameworks(frameworks);
  }, []);

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

  const validateName = (value) => {
    if (value.trim().length <= 0) {
      setValidName(false);
      setNameValidStatus('error');
      setNameHelpText('Please name your project');
    } else if (/^[a-z0-9-]+$/.test(value)) {
      setValidName(true);
      setNameValidStatus('success');
      setNameHelpText('');
    } else {
      setValidName(false);
      setNameValidStatus('error');
      setNameHelpText('Only letters, numbers and dashes are allowed. Spaces and special characters not allowed');
    }
    setName(value);
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
          name="module_name"
          hasFeedback
          validateStatus={nameValidStatus}
          help={nameHelpText}
          label="Module name"
          style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
          rules={[
            {
              required: true,
            },
          ]}>
          <Input onChange={(e) => validateName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Module Description" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}>
          <TextArea onChange={(e) => setDesc(e.target.value)} />
        </Form.Item>
        {/* Tech Stack questioning */}
        <Paragraph
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 400,
            textAlign: 'center',
          }}>
          Technology
        </Paragraph>
        <Form.Item
          name="framework"
          label="Framework?"
          style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
          rules={[
            {
              required: true,
              message: 'Please answer',
            },
          ]}>
          <Radio.Group>
            <Radio
              value="yes"
              onChange={() => {
                setFrameworkTouched(true);
                setIsFramework(true);
              }}>
              Yes
            </Radio>
            <Radio
              value="no"
              onChange={() => {
                setFrameworkTouched(true);
                setIsFramework(false);
              }}>
              no
            </Radio>
          </Radio.Group>
        </Form.Item>
        {/* Programming language */}
        {/* TODO Change this to fetch data from backend */}
        {frameworkTouched ? (
          !isFramework ? (
            <Form.Item
              name="project_type"
              label="Project Type"
              style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
              rules={[
                {
                  required: true,
                  message: 'Please choose type and version',
                },
              ]}>
              <LanguageSelector
                values={{
                  supportedLanguages,
                  selectedLanguage,
                  selectedVersion,
                }}
                handleChange={handleChange}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="framework_type"
              label="Framework Type"
              style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
              rules={[
                {
                  required: true,
                  message: 'Please choose framework and version',
                },
              ]}>
              <FrameworkSelector
                values={{
                  supportedFrameworks,
                  selectedLanguage,
                  selectedVersion,
                }}
                handleChange={handleChange}
              />
            </Form.Item>
          )
        ) : (
          <div />
        )}
        {frameworkTouched ? (
          <div>
            <Paragraph
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: 400,
                textAlign: 'center',
              }}>
              Specification
            </Paragraph>
            <Form.Item
              name="port"
              label="Port"
              style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
              rules={[
                {
                  required: true,
                  message: 'Please input the port you wish to run the service on',
                },
              ]}>
              <Input type="number" onChange={(e) => setPort(e.target.value)} />
            </Form.Item>
          </div>
        ) : (
          <div />
        )}
      </Form>
      <Button.Group style={{ width: '100%' }}>
        {/* TODO Add more validation when its time */}
        <Button
          disabled={!validName || selectedLanguage === null || selectedVersion === null || port.length < 2}
          type="primary"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          onClick={() => handleNext()}>
          Forward
          <RightOutlined />
        </Button>
      </Button.Group>
    </div>
  );
}

export default Setup;
