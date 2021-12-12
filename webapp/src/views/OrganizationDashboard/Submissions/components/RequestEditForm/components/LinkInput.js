import React, { useEffect } from 'react';
import { Form, Input, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
let id = 0;

function LinkInput(props) {
  const { getFieldDecorator, getFieldValue } = props.form;
  const { updateLinks, links } = props;

  const remove = (k) => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
    let arr = [];
    const names = getFieldValue('names');
    for (let i = 0; i < keys.length; i++) {
      if (names.indexOf(names[i]) !== k) {
        arr.push(names[i]);
      }
    }
    updateLinks(arr);
  };

  const add = () => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    linkChange();
  };

  const linkChange = () => {
    let arr = [];
    const names = getFieldValue('names');
    for (let i = 0; i < keys.length; i++) {
      arr.push(names[i]);
    }
    updateLinks(arr);
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
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    },
  };

  useEffect(() => {
    if (links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        add();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => (
    <Form.Item
      style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 450 }}
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={
        index === 0 ? (
          <span>
            Link(s)&nbsp;
            <Tooltip title="Link(s) can be link to hosted application, project on AutoPacker or a link to source code">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        ) : (
          ''
        )
      }
      required={false}
      key={k}>
      {getFieldDecorator(`names[${k}]`, {
        validateTrigger: ['onChange', 'onBlur'],
        initialValue: links[k],
      })(<Input placeholder="https:// ..." style={{ width: '90%', marginRight: 8 }} onChange={linkChange} />)}
      {keys.length > 1 ? <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(k)} /> : null}
    </Form.Item>
  ));
  return (
    <div>
      {formItems.length <= 0 ? (
        <Form.Item
          {...formItemLayout}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 450,
          }}
          label={
            <span>
              Link(s)&nbsp;
              <Tooltip title="Link(s) can be link to hosted application, project on AutoPacker or a link to source code">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }>
          <Button type="dashed" onClick={add}>
            <PlusOutlined /> Add Link
          </Button>
        </Form.Item>
      ) : (
        <div>
          {formItems}
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: -5,
              marginBottom: 16,
            }}>
            <Button type="dashed" onClick={add}>
              <PlusOutlined /> Add Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form.create({ name: 'dynamic_form_item' })(LinkInput);
