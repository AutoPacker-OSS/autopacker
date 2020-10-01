import { Button, Form, Input, Tooltip } from "antd";
import "./dynamicInput.css";
import React from "react";
import { QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
let id = 0;

function AuthorInput(props) {
	const { updateAuthors } = props;

	const authorChange = () => {
		//console.log(props.form);
		props.form.fields((err, values) => {
			if (!err) {
				console.log(values.names);
				//updateAuthors(values.names);
			}
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

	const formItemLayoutWithOutLabel = {
		wrapperCol: {
			xs: { span: 24, offset: 0 },
			sm: { span: 16, offset: 8 },
		},
	};

	const authorLabel = (
		<span>
			Author(s)&nbsp;
			<Tooltip title="Authors are shown with the projects they are assigned to. So here you can add your username(s), real name(s) or email(s). If you wish to stay anonymous, but still want to show yourself, you can use a pseudo-name">
				<QuestionCircleOutlined />
			</Tooltip>
		</span>
	);

	return (
		<Form.List name="names" onValuesChange={(changed, values) => console.log(values)}>
			{(fields, { add, remove }) => {
				return fields.length <= 0 ? (
					<Form.Item
						{...formItemLayout}
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							maxWidth: 450,
						}}
						label={authorLabel}
					>
						<Button type="dashed" onClick={add}>
							<PlusOutlined /> Add Author
						</Button>
					</Form.Item>
				) : (
					<div>
						{fields.map((field, index) => (
							<Form.Item
								{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
								label={index === 0 ? authorLabel : ""}
								required={false}
								key={field.key}
								style={{
									marginLeft: "auto",
									marginRight: "auto",
									maxWidth: 450,
								}}
							>
								<Form.Item
									{...field}
									validateTrigger={["onChange", "onBlur"]}
									rules={[
										{
											required: true,
											whitespace: true,
											message:
												"Please input author's name or delete this field.",
										},
									]}
									noStyle
								>
									<Input
										type="text"
										placeholder="Author name"
										style={{ width: "90%" }}
									/>
								</Form.Item>
								{fields.length > 1 ? (
									<MinusCircleOutlined
										className="dynamic-delete-button"
										style={{ margin: "0 8px" }}
										onClick={() => {
											remove(field.name);
										}}
									/>
								) : null}
							</Form.Item>
						))}
						<Form.Item
							style={{ marginRight: "auto", marginLeft: "auto", textAlign: "right" }}
						>
							<Button
								type="dashed"
								onClick={() => {
									add();
								}}
								style={{
									width: "40%",
									marginRight: "auto",
									marginLeft: "auto",
								}}
							>
								<PlusOutlined /> Add author
							</Button>
						</Form.Item>
					</div>
				);
			}}
		</Form.List>
	);
}

export default AuthorInput;
