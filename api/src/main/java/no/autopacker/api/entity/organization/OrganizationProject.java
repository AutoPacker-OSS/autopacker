package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONArray;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class OrganizationProject {

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
    private Organization organization;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="member_id")
    private Member member;

    private String authors;

    private String links;

    private boolean isAccepted;

    public OrganizationProject(Organization organization, Member member, JSONArray authors, Long actualProjectId, String name, String type, String desc, JSONArray links, JSONArray tags) {
        this.organization = organization;
        this.lastUpdated = new Date();
        this.member = member;
        setAuthors(authors);
        this.actualProjectId = actualProjectId;
        this.name = name;
        this.type = type;
        this.description = desc;
        setLinks(links);
        setTags(tags);
        this.isAccepted = false;
    }

    public OrganizationProject(Organization organization, Member member, String authors, Long actualProjectId, String name, String type, String desc, String links, JSONArray tags) {
        this.organization = organization;
        this.lastUpdated = new Date();
        this.member = member;
        this.authors = authors;
        this.actualProjectId = actualProjectId;
        this.name = name;
        this.type = type;
        this.description = desc;
        this.links = links;
        setTags(tags);
        this.isAccepted = false;
    }

    public void setAuthors(JSONArray jsonArray) {
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

    public void setLinks(JSONArray jsonArray) {
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

    public void setTags(JSONArray jsonArray) {
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
