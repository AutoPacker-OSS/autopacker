import { Button, Form, Input, Tooltip } from "antd";
import React from "react";
import { QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
let id = 0;

function LinkInput(props) {
	const { updateLinks } = props;

	const linkChange = (e) => {
		e.preventDefault();
		props.form.validateFields((err, values) => {
			if (!err) {
				updateLinks(values.names);
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

	return (
		<Form.List name="names">
			{(fields, { add, remove }) => {
				return (
					<div>
						{fields.map((field, index) => (
							<Form.Item
								{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
								label={index === 0 ? "Passengers" : ""}
								required={false}
								key={field.key}
							>
								<Form.Item
									{...field}
									validateTrigger={["onChange", "onBlur"]}
									rules={[
										{
											required: true,
											whitespace: true,
											message: "Please input passenger's name or delete this field.",
										},
									]}
									noStyle
								>
									<Input placeholder="passenger name" style={{ width: "60%" }} />
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
						<Form.Item>
							<Button
								type="dashed"
								onClick={() => {
									add();
								}}
								style={{ width: "60%" }}
							>
								<PlusOutlined /> Add field
							</Button>
						</Form.Item>
					</div>
				);
			}}
		</Form.List>
	);
}

export default LinkInput;
