import { Steps } from 'antd';
import React from 'react';
import Setup from './components/Setup/Setup';
// Custom components
import Summary from './components/Summary/Summary';
import Type from './components/Type/Type';
import UploadSection from './components/UploadSection/UploadSection';

function MultiModule() {
  // State
  const [activeStep, setActiveStep] = React.useState(0);

  // Complete information
  const [modules, setModules] = React.useState([]);

  // Single module Information
  const [selectedType, setSelectedType] = React.useState('');
  const [moduleSpec, setModuleSpec] = React.useState(null);

  // Get antd sub components
  const { Step } = Steps;

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const setSelectedModuleType = (type) => {
    setSelectedType(type);
    nextStep();
  };

  const addModule = (module) => {
    let arr = modules;
    arr.push(module);
    setModules(arr);
  };

  const steps = [
    {
      title: 'Summary',
      content: <Summary values={{ modules }} methods={{ nextStep }} />,
    },
    {
      title: 'Type',
      content: <Type methods={{ setSelectedModuleType, prevStep }} />,
    },
    {
      title: 'Setup',
      content: <Setup values={{ selectedType, moduleSpec }} methods={{ setModuleSpec, nextStep, prevStep }} />,
    },
    {
      title: 'File Upload',
      content: <UploadSection values={{ selectedType, moduleSpec }} methods={{ setActiveStep, prevStep, addModule }} />,
    },
    /* 		{
			title: "Building",
			content: <Building />,
		},
		{
			title: "Complete",
			content: <Complete values={{ uploadSuccess }} />,
		}, */
  ];

  return (
    <div style={{ width: '100%' }}>
      <Steps current={activeStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[activeStep].content}</div>
    </div>
  );
}

export default MultiModule;
