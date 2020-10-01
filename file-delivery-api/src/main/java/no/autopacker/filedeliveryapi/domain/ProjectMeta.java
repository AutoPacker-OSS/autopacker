package no.autopacker.filedeliveryapi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMeta {
	// Project Meta
	private long id;
	private String image;
	private String projectName;
	private String desc;
	private Date lastUpdated;
	// TODO Maybe use another data type for tags?
	private String tags;
	private String website;
	private boolean isPrivate;
	private List<ModuleMeta> modules;

	// Administrative meta
	private String owner;
	private String location;

	/**
	 * Minimum argument constructor
	 */
	public ProjectMeta(String name, String owner, String location, boolean isPrivate) {
		this.projectName = name;
		this.owner = owner;
		this.location = location;
		this.isPrivate = isPrivate;
		this.lastUpdated = new Date();
		this.modules = new ArrayList<>();
	}

	public ProjectMeta(JSONObject json) throws JSONException {
		this.projectName = json.getString("projectName");
		this.lastUpdated = new Date();
		this.isPrivate = json.getBoolean("isPrivate");
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
		// Tags
		if (json.has("tags")) {
			JSONArray jsonArray = json.getJSONArray("tags");
			String tags = "";
			for (int i = 0; i < jsonArray.length(); i++) {
				if (tags.trim().equals("")) {
					tags += jsonArray.get(i);
				} else {
					tags += "," + jsonArray.get(i);
				}
			}
			this.tags = tags;
		} else {
			this.tags = "";
		}
		// Website
		if (json.has("website")) {
			this.website = json.getString("website");
		} else {
			this.website = "";
		}
		this.modules = new ArrayList<>();
	}

	public boolean isPrivate() {
		return this.isPrivate;
	}

	public boolean hasModules() {
		return (modules != null && modules.size() > 0);
	}
}
