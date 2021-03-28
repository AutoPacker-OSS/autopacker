package no.autopacker.filedeliveryapi.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrgProjectMeta {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    private Date lastUpdated;

    @NotEmpty
    private String projectName;

    private String description;

    private String tags;

    private Long actualProjectId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="organization_id")
    private Long organization;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="member_id")
    private Long member;

    private String authors;

    private String links;

    private boolean isAccepted;

    public OrgProjectMeta(Long organization, Long member, JSONArray authors,  String name,
                           String desc, JSONArray links, JSONArray tags) throws JSONException {
        this.organization = organization;
        this.lastUpdated = new Date();
        this.member = member;
        setAuthors(authors);
        this.projectName = name;
        this.description = desc;
        setLinks(links);
        setTags(tags);
        this.isAccepted = false;
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
