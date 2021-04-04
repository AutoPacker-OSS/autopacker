package no.autopacker.api.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.annotation.ValidEmail;
import no.autopacker.api.entity.organization.Member;
import no.autopacker.api.entity.organization.Organization;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * Represents a user entity and contains methods for accessing user specific information
 */
@Data
@Entity
@NoArgsConstructor
public class User {

    @Id
    private String id;

    @NotEmpty
    @NotNull
    @Size(min = 4, max = 25)
    private String username;

    @NotEmpty
    @NotNull
    @ValidEmail
    private String email;

    private String name;

    private String image;
    private String systemRole;

    @JsonIgnore
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Member> organizations;


    /**
     * Constructor for objects of type User
     *
     * @param username the users' username
     * @param email    the users' email
     */
    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    /**
     * Constructor for objects of type User
     *
     * @param username the users' username
     * @param email    the users' email
     * @param image    the users' profile image
     */
    public User(String username, String email, String image) {
        this.username = username;
        this.email = email;
    }

    /**
     * Return true if the user's SYSTEM-WIDE role is equal to the specified role
     * @param role Role to check
     * @return True if the role matches, false otherwise
     */
    public boolean hasSystemRole(String role) {
        return systemRole != null && systemRole.equalsIgnoreCase(role);
    }

    /**
     * Checks if the user is a member of the given organization, with any possible role
     * @param organization
     * @return True when the user belongs to the organization, false otherwise
     */
    public boolean isMemberOf(Organization organization) {
        boolean isMember = false;
        Iterator<Member> it = organizations.iterator();
        while (!isMember && it.hasNext()) {
            isMember = it.next().getOrganization().equals(organization);
        }
        return isMember;
    }

    /**
     * Returns all organizations where the user is a member
     * @return A list of organizations, as Organization objects (not Member objects)!
     */
    @JsonIgnore
    public List<Organization> getAllOrganizations() {
        List<Organization> o = new LinkedList<>();
        for (Member m : organizations) {
            o.add(m.getOrganization());
        }
        return o;
    }

    @Override
    public String toString() {
        return "User " + username;
    }
}