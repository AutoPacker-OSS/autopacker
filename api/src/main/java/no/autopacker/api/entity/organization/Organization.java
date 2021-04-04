package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.entity.User;
import no.autopacker.api.entity.fdapi.Project;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import static no.autopacker.api.security.AuthConstants.ROLE_ADMIN;
import static no.autopacker.api.security.AuthConstants.ROLE_MEMBER;

@Data
@Entity
@NoArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty
    @Column(unique = true)
    @NaturalId
    private String name;

    private String image;

    private String description;

    private String url;

    private Boolean isPublic;

    @OneToMany(mappedBy = "organization")
    private List<Project> projects;

    @ManyToOne
    private User owner;

    @JsonIgnore
    @OneToMany(
            mappedBy = "organization",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Member> members;

    @JsonIgnore
    @OneToMany(mappedBy = "organization")
    private List<MemberApplication> memberApplications;

    @JsonIgnore
    @OneToMany(mappedBy = "organization")
    private List<ProjectApplication> projectApplications;

    public Organization(String name, String desc, String url, boolean isPublic, User owner) {
        this.name = name;
        this.description = desc;
        this.url = url;
        this.isPublic = isPublic;
        this.projects = new LinkedList<>();
        this.members = new LinkedList<>();
        this.owner = owner;
    }

    /**
     * Add a new member to the organization, with the regular MEMBER role
     * @param user The user to add
     */
    public void addMember(User user) {
        addMemberWithRole(user, ROLE_MEMBER);
    }

    /**
     * Add a new member to the organization, with the ADMIN role
     * @param user The user to add
     */
    public void addAdminMember(User user) {
        addMemberWithRole(user, ROLE_ADMIN);
    }

    /**
     * Returns true if the specified user is ADMIN member of the organization
     * @param user The user to check
     * @return True if it is, false otherwise
     */
    public boolean hasAdminMember(User user) {
        return hasMemberWithRole(user, ROLE_ADMIN);
    }

    /**
     * Returns true if the specified user is regular member of the organization.
     * Note: it does NOT mean that the user is not an admin as well! The user could have several roles in the organization!
     * @param user The user to check
     * @return True if it is, false otherwise
     */
    public boolean hasRegularMember(User user) {
        return hasMemberWithRole(user, ROLE_MEMBER);
    }

    /**
     * Add a new member to the organization, with a specified role. Note: If a membership of the same user with
     * another role already exists, it will NOT be removed!
     * @param user The user to add
     * @param role The role for the user in this organization
     */
    public void addMemberWithRole(User user, String role) {
        if (!hasMemberWithRole(user, role)) {
            members.add(new Member(this, user, role));
        }
    }

    /**
     * Return true if the organization has the given user as a member, with the specified role
     * @param user
     * @param role
     * @return
     */
    public boolean hasMemberWithRole(User user, String role) {
        boolean found = false;
        Iterator<Member> it = members.iterator();
        while (it.hasNext() && !found) {
            Member m = it.next();
            found = m.getUser().equals(user) && m.getRole().equals(role);
        }
        return found;
    }

    /**
     * Remove the user from the organization (with any role)
     * @param user The user to remove
     * @return True if removed, false if the user was not a member of the organization
     */
    public boolean removeMember(User user) {
        return members.removeIf(m -> m.getUser().equals(user));
    }
}
