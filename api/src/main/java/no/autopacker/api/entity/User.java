package no.autopacker.api.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.annotation.ValidEmail;

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
}