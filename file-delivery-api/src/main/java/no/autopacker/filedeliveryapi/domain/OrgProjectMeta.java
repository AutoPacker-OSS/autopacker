package no.autopacker.filedeliveryapi.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class OrgProjectMeta {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String image;

    private Date lastUpdated;

    @NotEmpty
    private String name;

    @NotEmpty
    private String type;

    private String description;

    private String tags;

    private Long actualProjectId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="organization_id")
    private String organizationId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="member_id")
    private String memberId;

    private String authors;

    private String links;

    private boolean isAccepted;

    public OrgProjectMeta(String organization, String member, JSONArray authors, Long actualProjectId, String name, String type, String desc, JSONArray links, JSONArray tags) throws JSONException {
        this.organizationId = organization;
        this.lastUpdated = new Date();
        this.memberId = member;
        setAuthors(authors);
        this.actualProjectId = actualProjectId;
        this.name = name;
        this.type = type;
        this.description = desc;
        setLinks(links);
        setTags(tags);
        this.isAccepted = false;
    }

    public OrgProjectMeta(String organization, String member, String authors, Long actualProjectId, String name, String type, String desc, String links, JSONArray tags) throws JSONException {
        this.organizationId = organization;
        this.lastUpdated = new Date();
        this.memberId = member;
        this.authors = authors;
        this.actualProjectId = actualProjectId;
        this.name = name;
        this.type = type;
        this.description = desc;
        this.links = links;
        setTags(tags);
        this.isAccepted = false;
    }

    public void setAuthors(JSONArray jsonArray)  {
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
