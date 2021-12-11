package no.autopacker.api.entity.fdapi;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.entity.User;
import no.autopacker.api.entity.organization.Organization;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    // Project Meta
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String image;
    @NotNull
    private String name;
    private String description;
    private Date lastUpdated = new Date();
    // TODO Maybe use another data type for tags?
    private String tags;
    private String website;
    private boolean isPrivate;

    @OneToMany(mappedBy = "project")
    private List<Module> modules;

    // Administrative meta
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    @NotNull
    private String location;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    /**
     * Minimum argument constructor
     */
    public Project(String name, User owner, boolean isPrivate) {
        this.name = name;
        this.owner = owner;
        this.location = "";
        this.isPrivate = isPrivate;
        this.modules = new ArrayList<>();
    }

    public Project(JSONObject json) throws JSONException {
        this.name = json.getString("name");
        this.isPrivate = json.getBoolean("isPrivate");
        // Conditionally set values
        // Image (TODO Need to create a better setup for image shitty)
        if (json.has("image")) {
            this.image = json.getString("image");
        } else {
            this.image = "";
        }
        // Description
        if (json.has("description")) {
            this.description = json.getString("description");
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

    public boolean hasOrganization() {
        return (organization != null);
    }
}
