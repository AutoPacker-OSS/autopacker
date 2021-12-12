import { Button, Card, Col, Row, Upload } from 'antd';
import React from 'react';
// Import styles
import './UploadSectionStyle.scss';
import {
  GithubOutlined,
  FileZipOutlined,
  CodeOutlined,
  InboxOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

function UploadSection(props) {
  const [executableSelected, setExecutableSelected] = React.useState(false);
  const [folderSelected, setFolderSelected] = React.useState(false);
  const [fileList, setFileList] = React.useState([]);
  // Import sub components from antd
  const { Dragger } = Upload;
  // Get methods from props
  const { setFile, nextStep, prevStep } = props.methods;

  const handleNext = () => {
    if (fileList.length > 0) {
      setFile(fileList);
      nextStep();
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.jar',
    method: 'post',
    withCredentials: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
  };

  const folderUploadProps = {
    name: 'file',
    multiple: false,
    accept: '.zip',
    method: 'post',
    withCredentials: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
  };

  const selectFolderUpload = (type) => {
    switch (type) {
      case 1:
        setExecutableSelected(false);
        setFolderSelected(true);
        break;

      case 2:
        setExecutableSelected(true);
        setFolderSelected(false);
        break;

      default:
        setExecutableSelected(false);
        setFolderSelected(false);
        break;
    }
  };

  return (
    <div>
      <Row className="upload-wrapper" type="flex" justify="center" gutter={[16]}>
        <Col span={5}>
          <Card style={{ margin: '0 auto' }} className="upload-card-disabled">
            <Row type="flex" justify="center" align="middle">
              <div style={{ textAlign: 'center' }}>
                <Col xs={24}>
                  <GithubOutlined style={{ fontSize: 30 }} />
                </Col>
                <Col style={{ fontSize: 20 }} xs={24}>
                  Github
                </Col>
              </div>
            </Row>
          </Card>
        </Col>
        <Col span={5}>
          <Card
            style={{ margin: '0 auto' }}
            className={folderSelected ? 'upload-card-active' : 'upload-card'}
            onClick={() => selectFolderUpload(1)}>
            <Row type="flex" justify="center" align="middle">
              <div style={{ textAlign: 'center' }}>
                <Col xs={24}>
                  <FileZipOutlined style={{ fontSize: 30 }} />
                </Col>
                <Col style={{ fontSize: 20 }} xs={24}>
                  .ZIP
                </Col>
              </div>
            </Row>
          </Card>
        </Col>
        <Col span={5}>
          <Card
            style={{ margin: '0 auto' }}
            className={executableSelected ? 'upload-card-active' : 'upload-card'}
            onClick={() => selectFolderUpload(2)}>
            <Row type="flex" justify="center" align="middle">
              <div style={{ textAlign: 'center' }}>
                <Col xs={24}>
                  <CodeOutlined style={{ fontSize: 30 }} />
                </Col>
                <Col style={{ fontSize: 20 }} xs={24}>
                  Executable
                </Col>
              </div>
            </Row>
          </Card>
        </Col>
        <Col xs={24}>
          <div style={{ maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
            {executableSelected ? (
              <Dragger
                {...uploadProps}
                style={{
                  marginTop: 30,
                  maxWidth: 400,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Dragger>
            ) : (
              <div />
            )}
            {folderSelected ? (
              <Dragger
                {...folderUploadProps}
                style={{
                  marginTop: 30,
                  maxWidth: 400,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag .zip to this area to upload</p>
              </Dragger>
            ) : (
              <div />
            )}
          </div>
        </Col>
        <Button.Group style={{ width: '100%', marginTop: 60 }}>
          <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Button type="primary" onClick={() => prevStep()}>
              <LeftOutlined />
              Backward
            </Button>
            <Button disabled={fileList.length <= 0} type="primary" onClick={() => handleNext()}>
              Upload
              <RightOutlined />
            </Button>
          </div>
        </Button.Group>
      </Row>
    </div>
  );
}

export default UploadSection;
