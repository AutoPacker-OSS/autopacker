package no.autopacker.api.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.annotation.ValidEmail;
import no.autopacker.api.entity.organization.Role;

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

    private String image;
    // System-wide role for the user - either member, or admin
    @ManyToOne
    private Role systemRole;

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
     * @param role
     * @return True if the role matches, false otherwise
     */
    public boolean hasSystemRole(String role) {
        return systemRole.getName().equalsIgnoreCase(role);
    }
}