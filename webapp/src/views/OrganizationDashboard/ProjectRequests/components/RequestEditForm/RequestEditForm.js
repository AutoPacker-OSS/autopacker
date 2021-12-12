import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Tag, Tooltip } from 'antd';
import axios from 'axios';
import { TweenOneGroup } from 'rc-tween-one';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAlert } from '../../../../../store/actions/generalActions';

// TODO - this should not be necessary - reuse project editing form
function RequestEditForm(props) {
  // Form state
  const [projectName, setProjectName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [links, setLinks] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [comment, setComment] = React.useState('');

  // Controller state
  const [tagInput, setTagInput] = React.useState('');

  // Import sub components from antd
  const { TextArea } = Input;
  const { Content } = Layout;

  const { request, setOpenEditModal, toggleRefresh } = props;

  const organizationName = sessionStorage.getItem('selectedOrganizationName');
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(request.project);
    setProjectName(request.project.name);
    setDesc(request.project.description);
    if (request.project.tags) {
      setTags(request.project.tags.split(','));
    } else {
      setTags([]);
    }
    if (request.project.website) {
      setLinks(request.project.website.split(','));
    } else {
      setLinks([]);
    }
    setComment(request.comment);
  }, []);

  const removeTag = (removedTag) => {
    const tagsa = tags.filter((tag) => tag !== removedTag);
    setTags(tagsa);
  };

  const handleTagInputConfirm = () => {
    let tagsa = tags;
    if (tagInput && tagsa.indexOf(tagInput) === -1) {
      tagsa = [...tags, tagInput];
    }
    setTags(tagsa);
    setTagInput('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios({
    	method: "post",
    	url:
    		process.env.REACT_APP_APPLICATION_URL +
    		process.env.REACT_APP_API +
    		"/organization/updateProjectSubmission",
    	headers: {
    		// Authorization: authState.accessToken !== null ? `Bearer ${authState.accessToken}` : undefined,
    	},
    	data: {
    		organizationName: organizationName,
    		projectName: projectName,
    		desc: desc,
    		links: links,
    		tags: tags,
    		comment: comment,
    		projectId: request.project.id,
    	},
    })
    	.then(function () {
    		dispatch(
    			createAlert(
    				"Project request updated",
    				"You have successfully updated the project information. You should notify the with the changes you have made in the comment section when accepting.",
    				"success",
    				true
    			)
    		);
    		toggleRefresh();
    		setOpenEditModal(false);
    	})
    	.catch(() => {
    		dispatch(
    			createAlert(
    				"Project request update failed",
    				"Something went wrong while trying to update the project.",
    				"error",
    				true
    			)
    		);
    		toggleRefresh();
    		setOpenEditModal(false);
    	});
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
    <div style={{ width: '100%' }}>
      {/* Can add the Content thingy to route to be common, but might want to do something about the breadcrumb thingy */}
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
        }}>
        {/* TODO Change active component to be data display instead of form after submitting change */}

        <Form
          {...formItemLayout}
          initialValues={{
            ['project_name']: request.project.name,
            ['project_type']: request.project.type,
          }}>
          {/* Project Name */}
          <Form.Item
            name="project_name"
            label="Project Name"
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 }}
            rules={[
              {
                required: true,
                message: 'Please name your project',
              },
            ]}>
            <Input disabled onChange={(event) => setProjectName(event.target.value)} />
          </Form.Item>
          {/* Project Description */}
          <Form.Item label="Project Description" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 450 }}>
            <TextArea disabled defaultValue={request.project.description} onChange={(e) => setDesc(e.target.value)} />
          </Form.Item>
          {/* Tags Section (handling & displaying) */}
          <Form.Item
            label={
              <span>
                Tags&nbsp;
                <Tooltip title="Tags can be used to identify and search for projects">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 450 }}>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={handleTagInputConfirm}
            />
          </Form.Item>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            <TweenOneGroup
              enter={{
                scale: 0.8,
                opacity: 0,
                type: 'from',
                duration: 100,
                onComplete: (e) => {
                  e.target.style = '';
                },
              }}
              leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
              appear={false}>
              {tags.map((tag) => (
                <span key={tag} style={{ display: 'inline-block' }}>
                  <Tag
                    color="blue"
                    closable
                    onClose={(e) => {
                      e.preventDefault();
                      removeTag(tag);
                    }}>
                    {tag}
                  </Tag>
                </span>
              ))}
            </TweenOneGroup>
          </div>
          {/* Author(s) Section */}
          {/* <AuthorInput
						authors={request.organizationProject.authors.split(", ")}
						updateAuthors={setAuthors}
					/> */}
          {/* Link(s) Section */}
          {/* <LinkInput links={request.organizationProject.links.split(", ")} updateLinks={setLinks} /> */}
          {/* Comment Input */}
          <Form.Item
            label={
              <span>
                Comment&nbsp;
                <Tooltip title="Can be anything, why you want the selected role, why you want to join etc.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: 400,
            }}>
            <TextArea disabled defaultValue={request.comment} onChange={(event) => setComment(event.target.value)} />
          </Form.Item>
          {/* Button Section */}
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Button style={{ marginRight: 10 }} onClick={() => setOpenEditModal(false)}>
              Cancel Edit
            </Button>
            <Button type="primary" onClick={(e) => handleSubmit(e)}>
              Submit Changes
            </Button>
          </div>
        </Form>
      </Content>
    </div>
  );
}

export default RequestEditForm;
