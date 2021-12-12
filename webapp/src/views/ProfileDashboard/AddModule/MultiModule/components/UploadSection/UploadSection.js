import React from 'react';
import Application from './components/Application/Application';
// Custom components
import Database from './components/Database/Database';

function UploadSection(props) {
  // Get methods from props
  const { setActiveStep, prevStep, addModule } = props.methods;
  const { selectedType, moduleSpec } = props.values;

  const getType = () => {
    switch (selectedType) {
      case 'database':
        return <Database values={{ moduleSpec }} methods={{ setActiveStep, prevStep, addModule }} />;

      case 'application':
        return <Application values={{ moduleSpec }} methods={{ setActiveStep, prevStep, addModule }} />;

      default:
        break;
    }
  };

  return <div>{getType()}</div>;
}

export default UploadSection;
