import React, { forwardRef } from "react";
import { Select } from "antd";

const LanguageSelector = forwardRef((props, ref) => {
	// Extract values and methods from props
	const { supportedFrameworks, selectedLanguage, selectedVersion } = props.values;
	const { handleChange } = props;

	// Extract sub components from antd
	const { Option } = Select;

	return (
		<div>
			<Select
				showSearch
				placeholder="Framework type"
				optionFilterProp="children"
				type="text"
				onChange={(value) => {
					handleChange(1, null);
					handleChange(
						0,
						supportedFrameworks.find((language) => language.id === value)
					);
				}}
				style={{ width: "65%", marginRight: "3%" }}
				filterOption={(input, option) =>
					option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			>
				{supportedFrameworks.map((language) => (
					<Option value={language.id} key={language.id}>
						{language.name}
					</Option>
				))}
			</Select>
			{selectedLanguage !== null ? (
				<Select
					defaultValue={selectedLanguage.versions[0].id}
					value={selectedVersion === null ? "" : selectedVersion.version}
					style={{ width: "32%" }}
					onChange={(value) => {
						handleChange(
							1,
							selectedLanguage.versions.find((version) => version.id === value)
						);
					}}
				>
					{selectedLanguage.versions.map((version) => (
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

export default LanguageSelector;
