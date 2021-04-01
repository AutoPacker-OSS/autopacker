package no.autopacker.api.service;

import no.autopacker.api.entity.User;
import no.autopacker.api.repository.UserRepository;
import no.autopacker.api.userinterface.UserService;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Contains the main logic for handling authentication and user related features
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    // The password must satisfy the given criteria:
    //
    // Password must contain at least 1 lowercase alphabetical character
    // Password must contain at least 1 uppercase alphabetical character
    // Password must contain at least 1 numeric character
    // Password must be eight characters or longer
    private static final String VALID_PATTERN = "((?=.*[a-z])(?=.*\\d)(?=.*[A-Z]).{8,40})";

    // Services
    private final KeycloakServiceImpl keycloakService;

    // Repositories
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(
            KeycloakServiceImpl keycloakService,
            UserRepository userRepository) {
        this.keycloakService = keycloakService;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new user from the given user object if there is no existing user with matching
     * email and/or password.
     *
     * @param user   the user in which to be created
     * @param locale represents the geographical region in which the request was sent
     * @return a OK response if everything is a success or a descriptive BAD_REQUEST if something *
     * goes wrong
     */
    @Override
    public ResponseEntity<String> createNewUser(User user, String password, Locale locale) {
        User userFound = this.userRepository.findByUsername(user.getUsername());
        if (userFound == null) {
            userFound = this.userRepository.findByEmail(user.getEmail());
            if (userFound == null) {
                if (validatePassword(password)) {
                    // Add user to keycloak
                    String userId = this.keycloakService.createNewUser(user, password);

                    // Update user id with the GUID received from keycloak registration
                    user.setId(userId);

                    // Lastly add the user meta to user table
                    this.userRepository.save(user);

                    return ResponseEntity.ok().build();
                } else {
                    return new ResponseEntity<>("Password not valid", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("The email is already in use", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Username is already taken", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public Optional<User> findById(Long id) {
        return this.userRepository.findById(id);
    }

    @Override
    public List<User> findAllUsers() {
        return this.userRepository.findAll();
    }

    /* *//** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Contains the logic for changing a password for an authenticated user on demand
     *
     * @param oldPassword The users' old password
     * @param newPassword The users' new password
     * @return OK if password is successfully changed and BAD_REQUEST if not
     *//*
    @Override
    public ResponseEntity<String> changePassword(String oldPassword, String newPassword,
        String confirmPassword) {
        User user = this.userRepository
            .findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        // TODO Use this to get the Keycloak principle, and extract user information from here. ( principle.getKeycloakSecurityContext().getToken().getSubject() )
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> principal = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (user != null) {
            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                if (validatePassword(newPassword)) {
                    if (newPassword.equals(confirmPassword)) {
                        user.setPassword(this.passwordEncoder.encode(newPassword));
                        this.userRepository.save(user);
                        return new ResponseEntity<>("Password updated", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>(
                            "New password doesn't match the confirmed password", HttpStatus.OK);
                    }
                } else {
                    return new ResponseEntity<>(
                        "Password doesn't meet the given requirements", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Password doesn't match", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
        }
    }*/

    /**
     * Returns true if username is available and false if not
     *
     * @param username username to check
     * @return true if username is available and false if not
     */
    @Override
    public boolean validateUsername(String username) {
        User foundUser = this.userRepository.findByUsernameIgnoreCase(username);
        return foundUser == null;
    }

    /**
     * Returns true if email is available and false if not
     *
     * @param email email to check
     * @return true if email is available and false if not
     */
    @Override
    public boolean validateEmail(String email) {
        User foundUser = this.userRepository.findByEmailIgnoreCase(email);
        return foundUser == null;
    }

    /**
     * Overrides an existing user entry in the database
     *
     * @param user the user to update
     */
    @Override
    public void updateUser(User user) {
        this.userRepository.save(user);
    }

    @Override
    public List<User> searchAllUsers(String search) {
        return this.userRepository.findAllByUsernameContaining(search);
    }

    /**
     * Used to validate a given string (in this case password) against a regular expression
     *
     * @param password password to validate
     * @return true if valid and false if not
     */
    @Override
    public boolean validatePassword(String password) {
        // Validate password
        Pattern pattern = Pattern.compile(VALID_PATTERN);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }

    /**
     * Uploads a profile image to the user entity
     */
    @Override
    public ResponseEntity<String> uploadProfileImage(String base64File) {
        User foundUser = getAuthenticatedUser();
        if (foundUser != null) {
            foundUser.setImage(base64File);
            this.userRepository.save(foundUser);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public User getAuthenticatedUser() {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser =
                (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        User user = null;
        if (authenticatedUser != null) {
            String username = authenticatedUser.getKeycloakSecurityContext().getToken().getPreferredUsername();
            if (username != null) {
                user = this.userRepository.findByUsername(username);
            }
        }
        return user;
    }
}
