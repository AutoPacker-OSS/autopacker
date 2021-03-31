import React, { useEffect } from "react";
import { Form, Input, Button, Tooltip } from "antd";
import { QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
let id = 0;

function AuthorInput(props) {
	const { getFieldDecorator, getFieldValue } = props.form;
	const { updateAuthors, authors } = props;

	useEffect(() => {
		if (authors.length > 0) {
			for (let i = 0; i < authors.length; i++) {
				add();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const remove = (k) => {
		const { form } = props;
		// can use data-binding to get
		const keys = form.getFieldValue("keys");
		// We need at least one passenger
		if (keys.length === 1) {
			return;
		}

		// can use data-binding to set
		form.setFieldsValue({
			keys: keys.filter((key) => key !== k),
		});
		let arr = [];
		const names = getFieldValue("names");
		for (let i = 0; i < keys.length; i++) {
			if (names.indexOf(names[i]) !== k) {
				arr.push(names[i]);
			}
		}
		updateAuthors(arr);
	};

	const add = () => {
		const { form } = props;
		// can use data-binding to get
		const keys = form.getFieldValue("keys");

		const nextKeys = keys.concat(id++);
		// can use data-binding to set
		// important! notify form to detect changes
		form.setFieldsValue({
			keys: nextKeys,
		});
		authorChange();
	};

	const authorChange = () => {
		let arr = [];
		const names = getFieldValue("names");
		for (let i = 0; i < keys.length; i++) {
			arr.push(names[i]);
		}
		updateAuthors(arr);
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
	getFieldDecorator("keys", { initialValue: [] });
	const keys = getFieldValue("keys");
	const formItems = keys.map((k, index) => (
		<Form.Item
			style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 450 }}
			{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
			label={
				index === 0 ? (
					<span>
						Author(s)&nbsp;
						<Tooltip title="Authors are shown with the projects they are assigned to. So here you can add your username(s), real name(s) or email(s). If you wish to stay anonymous, but still want to show yourself, you can use a pseudo-name">
							<QuestionCircleOutlined />
						</Tooltip>
					</span>
				) : (
					""
				)
			}
			required={false}
			key={k}
		>
			{getFieldDecorator(`names[${k}]`, {
				validateTrigger: ["onChange", "onBlur"],
				initialValue: authors[k],
			})(<Input placeholder="author name" style={{ width: "90%", marginRight: 8 }} onChange={() => authorChange()} />)}
			{keys.length > 1 ? <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(k)} /> : null}
		</Form.Item>
	));
	return (
		<div>
			{formItems.length <= 0 ? (
				<Form.Item
					{...formItemLayout}
					style={{
						marginLeft: "auto",
						marginRight: "auto",
						maxWidth: 450,
					}}
					label={
						<span>
							Author(s)&nbsp;
							<Tooltip title="Authors are shown with the projects they are assigned to. So here you can add your username(s), real name(s) or email(s). If you wish to stay anonymous, but still want to show yourself, you can use a pseudo-name">
								<QuestionCircleOutlined />
							</Tooltip>
						</span>
					}
				>
					<Button type="dashed" onClick={add}>
						<PlusOutlined /> Add Author
					</Button>
				</Form.Item>
			) : (
				<div>
					{formItems}
					<div
						style={{
							width: "100%",
							textAlign: "center",
							marginTop: -5,
							marginBottom: 16,
						}}
					>
						<Button type="dashed" onClick={add}>
							<PlusOutlined /> Add Author
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Form.create({ name: "dynamic_form_item" })(AuthorInput);
