package no.autopacker.api.userinterface;

import no.autopacker.api.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

public interface UserService {

    Optional<User> findById(Long id);

    List<User> findAllUsers();

    ResponseEntity<String> createNewUser(User user, String password, Locale locale);

    // TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
    //ResponseEntity<String> changePassword(String oldPassword, String newPassword, String confirmPassword);

    boolean validateUsername(String username);

    boolean validateEmail(String email);

    void updateUser(User user);

    List<User> searchAllUsers(String search);

    boolean validatePassword(String password);

    ResponseEntity<String> uploadProfileImage(String base64File);

    /**
     * Return the current user or null if the user has not logged in
     * @return
     */
    User getAuthenticatedUser();
}
