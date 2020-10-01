package no.autopacker.filedeliveryapi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleMeta {
	// Module Meta
	private long id;
	private String name;
	private String desc;
	private String image;
	private int port;
	private String framework;
	private String language;
	// This needs to be string as it can hold char as values
	private String version;

	// Administrative Meta
	private String configType;
	private String location;
	private long projectId;

	public ModuleMeta(String name, int port, String language, String version, String configType, String location, long projectId) {
		this.name = name;
		this.port = port;
		this.language = language;
		this.version = version;
		this.configType = configType;
		this.location = location;
		this.projectId = projectId;
	}

	public ModuleMeta(JSONObject json, String location) throws JSONException {
		this.name = json.getString("name");
		this.port = json.getInt("port");
		this.language = json.getString("language");
		this.version = json.getString("version");
		this.configType = json.getString("configType");
		this.projectId = json.getLong("projectId");
		// Conditionally set values
		// Image (TODO Need to create a better setup for image shitty)
		if (json.has("image")) {
			this.image = json.getString("image");
		} else {
			this.image = "";
		}
		// Description
		if (json.has("desc")) {
			this.desc = json.getString("desc");
		} else {
			this.desc = "";
		}
		// Framework
		if (json.has("framework")) {
			this.framework = json.getString("framework");
		} else {
			this.framework = "";
		}
	}

}
