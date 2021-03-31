package no.autopacker.api.entity.fdapi;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class OrgProject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date lastUpdated;

    @NotEmpty
    private String name;

    private String description;

    private String tags;

    private String organizationName;

    private String user;

    private String authors;

    private String links;

    private boolean isAccepted;

    private boolean isSubmitted;

    public OrgProject(String organizationName, String user, JSONArray authors, String name,
                      String desc, String links, JSONArray tags) throws JSONException {
        this.organizationName = organizationName;
        this.lastUpdated = new Date();
        this.user = user;
        setAuthors(authors);
        this.name = name;
        this.description = desc;
        setLinks(links);
        setTags(tags);
        this.isAccepted = false;
        this.isSubmitted = false;

    }



    public void setAuthors(JSONArray jsonArray) throws JSONException {
        String list = "";
        for (int i = 0; i < jsonArray.length(); i++) {
            if (list.trim().equals("")) {
                list += jsonArray.get(i);
            } else {
                list += ", " + jsonArray.get(i);
            }
        }
        this.authors = list;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public void setLinks(String links) {
        this.links = links;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public void setLinks(JSONArray jsonArray) throws JSONException {
        String list = "";
        for (int i = 0; i < jsonArray.length(); i++) {
            if (list.trim().equals("")) {
                list += jsonArray.get(i);
            } else {
                list += ", " + jsonArray.get(i);
            }
        }
        this.links = list;
    }

    public void setTags(JSONArray jsonArray) throws JSONException {
        String list = "";
        for (int i = 0; i < jsonArray.length(); i++) {
            if (list.trim().equals("")) {
                list += jsonArray.get(i);
            } else {
                list += "," + jsonArray.get(i);
            }
        }
        this.tags = list;
    }


}
