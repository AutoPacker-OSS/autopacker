import { Select } from "antd";
import React, { forwardRef } from "react";

const ToolSelector = forwardRef((props, ref) => {
	// Extract values and methods from props
	const { supportedDatabases, database, version } = props.values;
	const { handleChange } = props.methods;

	// Extract sub components from antd
	const { Option } = Select;

	return (
		<div>
			<Select
				showSearch
				placeholder="Database"
				optionFilterProp="children"
				type="text"
				onChange={(value) => {
					handleChange(5, null);
					handleChange(
						4,
						supportedDatabases.find((database) => database.id === value)
					);
				}}
				style={{ width: "65%", marginRight: "3%" }}
				filterOption={(input, option) =>
					option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			>
				{supportedDatabases.map((database) => (
					<Option value={database.id} key={database.id}>
						{database.name}
					</Option>
				))}
			</Select>
			{database !== null ? (
				<Select
					defaultValue={database.versions[0].id}
					value={version === null ? "" : version.version}
					style={{ width: "32%" }}
					onChange={(value) => {
						handleChange(
							5,
							database.versions.find((version) => version.id === value)
						);
					}}
				>
					{database.versions.map((version) => (
						<Option value={version.id} key={version.id}>
							{version.version}
						</Option>
					))}
				</Select>
			) : (
				<div />
			)}
		</div>
	);
});

export default ToolSelector;
