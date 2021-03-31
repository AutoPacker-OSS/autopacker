package no.autopacker.userservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="projects")
public class ProjectMeta {
	// Project Meta
	@Id
	private long id;
	private String image;
	@NotNull
	private String name;
	private String description;
	private Date lastUpdated = new Date();
	// TODO Maybe use another data type for tags?
	private String tags;
	private String website;
	@NotNull
    @Column(columnDefinition = "TINYINT(1) NOT NULL DEFAULT 0")
	private boolean isPrivate;
	@OneToMany(mappedBy = "project")
	private Set<ModuleMeta> modules = new HashSet<>();

	// Administrative meta
    @NotNull
	private String owner;
    @NotNull
	private String location;

	/**
	 * Minimum argument constructor
	 */
	public ProjectMeta(String name, String owner, String location, boolean isPrivate) {
		this.name = name;
		this.owner = owner;
		this.location = location;
		this.isPrivate = isPrivate;
	}

	public ProjectMeta(JSONObject json) throws JSONException {
		this.name = json.getString("projectName");
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
			this.description = json.getString("desc");
		} else {
			this.description = "";
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
	}

	public boolean isPrivate() {
		return this.isPrivate;
	}

	public boolean hasModules() {
		return (modules != null && modules.size() > 0);
	}
}
