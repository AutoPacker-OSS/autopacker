package no.autopacker.userservice.userinterface;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import no.autopacker.userservice.entity.PasswordResetToken;
import no.autopacker.userservice.entity.User;
import no.autopacker.userservice.entity.VerificationToken;
import org.springframework.http.ResponseEntity;

public interface UserService {

    Optional<User> findById(Long id);

    User save(User foo);

    List<User> findAllUsers();

    List<VerificationToken> findAllVerificationTokens();

    List<PasswordResetToken> findAllPasswordResetTokens();

    // TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
    //ResponseEntity<String> createNewUser(User user, Locale locale);

    ResponseEntity<String> resendVerificationToken();

    ResponseEntity<String> resendVerificationToken(String oldToken);

    // TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
    //ResponseEntity<String> resetPassword(String email);

    // TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
    // ResponseEntity<String> resetPasswordChange(String token, String password, String password2);

    // TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
    //ResponseEntity<String> changePassword(String oldPassword, String newPassword, String confirmPassword);

    boolean validateUsername(String username);

    boolean validateEmail(String email);

    VerificationToken getVerificationToken(String verificationToken);

    void updateUser(User user);

    void createVerificationToken(User user, String token);

    VerificationToken generateNewVerificationToken(String existingVerificationToken);

    List<User> searchAllUsers(String search);

    boolean validatePassword(String password);

}
