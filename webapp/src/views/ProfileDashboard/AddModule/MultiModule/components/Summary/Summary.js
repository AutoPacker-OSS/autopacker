import { Button, Descriptions } from "antd";
import React from "react";

function Summary(props) {
	// State
	const { modules } = props.values;
	const { nextStep } = props.methods;

	return (
		<div style={{ width: "100%" }}>
			<div style={{ marginTop: 20 }}>
				{modules.length > 0 ? (
					modules.map((module) => (
						<div key={modules.indexOf(module)}>
							{module.moduleSpec.type === "database" ? (
								/* If database then show this */
								<Descriptions title={"Module " + (modules.indexOf(module) + 1)}>
									<Descriptions.Item label="Module Name">
										{module.moduleSpec.name}
									</Descriptions.Item>
									<Descriptions.Item label="Module Description">
										{module.moduleSpec.desc}
									</Descriptions.Item>
									<Descriptions.Item label="Type">
										{module.moduleSpec.type}
									</Descriptions.Item>
									<Descriptions.Item label="DB Name">
										{module.moduleSpec.dbName}
									</Descriptions.Item>
									<Descriptions.Item label="DB Username">
										{module.moduleSpec.dbUsername}
									</Descriptions.Item>
									<Descriptions.Item label="Database & version">
										{module.moduleSpec.database.name +
											" " +
											module.moduleSpec.version.version}
									</Descriptions.Item>
									<Descriptions.Item label="Port">
										{module.moduleSpec.port}
									</Descriptions.Item>
									{module["module-file"].length > 0 ? (
										<Descriptions.Item label="File">
											{module["module-file"][0].name}
										</Descriptions.Item>
									) : (
										<div />
									)}
								</Descriptions>
							) : (
								/* If application then show this */
								<Descriptions title={"Module " + (modules.indexOf(module) + 1)}>
									<Descriptions.Item label="Module Name">
										{module.moduleSpec.name}
									</Descriptions.Item>
									<Descriptions.Item label="Module Description">
										{module.moduleSpec.desc}
									</Descriptions.Item>
									<Descriptions.Item label="Type">
										{module.moduleSpec.type}
									</Descriptions.Item>
									<Descriptions.Item label="Programming language & version">
										{module.moduleSpec.language.name +
											" " +
											module.moduleSpec.version.version}
									</Descriptions.Item>
									<Descriptions.Item label="Port">
										{module.moduleSpec.port}
									</Descriptions.Item>
									<Descriptions.Item label="File">
										{module["module-file"][0].name}
									</Descriptions.Item>
								</Descriptions>
							)}
						</div>
					))
				) : (
					<p>No modules added...</p>
				)}
			</div>
			<div style={{ textAlign: "center", marginTop: 20 }}>
				<Button
					style={{ marginRight: 20 }}
					size="large"
					icon="plus"
					onClick={() => nextStep()}
				>
					Add Module
				</Button>
				<Button disabled type="primary" size="large" onClick={() => console.warn("NOT YET IMPLEMENTED")}>
					Submit Modules
				</Button>
			</div>
		</div>
	);
}

export default Summary;
