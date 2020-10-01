package no.autopacker.userservice.service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import no.autopacker.userservice.config.AppConfig;
import no.autopacker.userservice.entity.PasswordResetToken;
import no.autopacker.userservice.entity.User;
import no.autopacker.userservice.entity.VerificationToken;
import no.autopacker.userservice.event.OnRegistrationCompleteEvent;
import no.autopacker.userservice.repository.PasswordResetTokenRepository;
import no.autopacker.userservice.repository.UserRepository;
import no.autopacker.userservice.repository.VerificationTokenRepository;
import no.autopacker.userservice.userinterface.UserService;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private PasswordEncoder passwordEncoder;
    private ApplicationEventPublisher eventPublisher;
    private JavaMailSender javaMailSender;

    // Repositories
    private UserRepository userRepository;
    private VerificationTokenRepository verificationTokenRepository;
    private PasswordResetTokenRepository passwordResetTokenRepository;

    // Config
    private final AppConfig appConfig;

    @Autowired
    public UserServiceImpl(
        AppConfig appConfig,
        PasswordEncoder passwordEncoder,
        ApplicationEventPublisher eventPublisher,
        JavaMailSender javaMailSender,
        UserRepository userRepository,
        VerificationTokenRepository verificationTokenRepository,
        PasswordResetTokenRepository passwordResetTokenRepository) {
        this.appConfig = appConfig;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
        this.javaMailSender = javaMailSender;
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public Optional<User> findById(Long id) {
        return this.userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return this.userRepository.save(user);
    }

    @Override
    public List<User> findAllUsers() {
        return this.userRepository.findAll();
    }

    /** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Creates a new user from the given user object if there is no existing user with matching
     * email and/or password. Then publishes the OnRegistrationCompleteEvent for email verification
     * and returns a OK response if everything is a success or a descriptive BAD_REQUEST if
     * something goes wrong
     *
     * @param user   the user in which to be created
     * @param locale represents the geographical region in which the request was sent
     * @return a OK response if everything is a success or a descriptive BAD_REQUEST if something *
     * goes wrong
     */
    /*@Override
    public ResponseEntity<String> createNewUser(User user, Locale locale) {
        User userFound = this.userRepository.findByUsername(user.getUsername());
        if (userFound == null) {
            userFound = this.userRepository.findByEmail(user.getEmail());
            if (userFound == null) {
                if (validatePassword(user.getPassword())) {
                    user.setPassword(this.passwordEncoder.encode(user.getPassword()));
                    this.userRepository.save(user);
                    // After the user have successfully been persisted send a verification mail
                    try {
                        eventPublisher.publishEvent(
                            new OnRegistrationCompleteEvent(this.appConfig.getWebApplicationUrl(),
                                locale, user));
                        return new ResponseEntity<>("OK", HttpStatus.OK);
                    } catch (Exception me) {
                        // TODO Delete user if sending of verification mail failed
                        return new ResponseEntity(
                            "Something went wrong when sending verification email",
                            HttpStatus.BAD_REQUEST);
                    }
                } else {
                    return new ResponseEntity<>("Password not valid", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("The email is already in use", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Username is already taken", HttpStatus.BAD_REQUEST);
        }
    }*/

    /**
     * Resend a new verification token when requested
     *
     * @return OK if a new email containing a new verification token is sent and BAD_REQUEST if not
     */
    @Override
    public ResponseEntity<String> resendVerificationToken() {
        User user = this.userRepository.findByUsername(
            SecurityContextHolder.getContext().getAuthentication().getName());
        if (user != null) {
            VerificationToken newToken = generateNewVerificationToken(
                this.verificationTokenRepository.findByUser(user).getTokenVal());
            if (newToken != null) {
                String confirmationUrl =
                    this.appConfig.getWebApplicationUrl() + "/registrationConfirmation?token="
                        + newToken.getTokenVal();
                // Build the email
                SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                simpleMailMessage.setFrom("AutoPacker");
                simpleMailMessage.setSubject("Resend Verification email");
                simpleMailMessage.setTo(user.getEmail());
                // Build message
                String stringBuilder =
                    "Hi "
                        + user.getUsername()
                        + ",\n\n"
                        + "Below is your new verification link. If you didn't request it, you should take security measures\n\n"
                        + confirmationUrl
                        + "\n\nBest Regards,\n\nThe AutoPacker Team";
                simpleMailMessage.setText(stringBuilder);
                // Send the email
                this.javaMailSender.send(simpleMailMessage);
                return new ResponseEntity<>("New verification mail sent", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Token not valid", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User not found?", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Resend a new verification token when requested
     *
     * @return OK if a new email containing a new verification token is sent and BAD_REQUEST if not
     */
    @Override
    public ResponseEntity<String> resendVerificationToken(String oldToken) {
        VerificationToken newToken = generateNewVerificationToken(oldToken);
        if (newToken != null) {
            User user = newToken.getUser();
            if (user != null) {
                String confirmationUrl =
                    this.appConfig.getWebApplicationUrl() + "/registrationConfirmation?token="
                        + newToken.getTokenVal();
                // Build the email
                SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                simpleMailMessage.setFrom("AutoPacker");
                simpleMailMessage.setSubject("Resend Verification email");
                simpleMailMessage.setTo(user.getEmail());
                // Build message
                String stringBuilder =
                    "Hi "
                        + user.getUsername()
                        + ",\n\n"
                        + "Below is your new verification link. If you didn't request it, you should take security measures\n\n"
                        + confirmationUrl
                        + "\n\nBest Regards,\n\nThe AutoPacker Team";
                simpleMailMessage.setText(stringBuilder);
                // Send the email
                this.javaMailSender.send(simpleMailMessage);
                return new ResponseEntity<>("New verification mail sent", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found?", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Token not valid", HttpStatus.BAD_REQUEST);
        }
    }

    /** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Contains the logic to perform a reset password request which sends an email to the specified
     * email containing a token that can be used to reset the users' password
     *
     * @param email the users' email
     * @return OK if reset password token is sent successfully and BAD_REQUEST if not
     */
   /* @Override
    public ResponseEntity<String> resetPassword(String email) {
        User user = this.userRepository.findByEmail(email);
        if (user != null) {
            // Create and store password reset token
            String token = UUID.randomUUID().toString();
            this.passwordResetTokenRepository.save(new PasswordResetToken(user, token));
            String resetUrl =
                this.appConfig.getApplicationUrl() + "/auth/resetPassword?token=" + token;
            // Build the email
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom("AutoPacker");
            simpleMailMessage.setSubject("Reset Password");
            simpleMailMessage.setTo(email);
            // Build message
            String stringBuilder =
                "Hi "
                    + user.getUsername()
                    + ",\n\n"
                    + "A password reset has been requested for your account. "
                    + "If you did not make this request, you can ignore this email\n\n"
                    + resetUrl
                    + "\n\nBest Regards,\n\nThe AutoPacker Team";
            simpleMailMessage.setText(stringBuilder);
            // Send the email
            this.javaMailSender.send(simpleMailMessage);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("The given email doesn't exist", HttpStatus.BAD_REQUEST);
        }
    }*/

    /** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Performs a reset password change which takes in the reset password token for verification and
     * the * new password that the user wants to set
     *
     * @param token     the reset password token
     * @param password  the password the user want to set
     * @param password2 the password the user want to set
     * @return OK if password is successfully changed for the given user and BAD_REQUEST if not
     */
    /*@Override
    public ResponseEntity<String> resetPasswordChange(
        String token, String password, String password2) {
        PasswordResetToken passwordResetToken = this.passwordResetTokenRepository
            .findByTokenVal(token);
        if (passwordResetToken != null) {
            User user = passwordResetToken.getUser();
            if (password.equals(password2)) {
                if (validatePassword(password)) {
                    user.setPassword(this.passwordEncoder.encode(password));
                    this.userRepository.save(user);
                    return new ResponseEntity<>("Password updated", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(
                        "Password doesn't meet the given requirements", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Passwords aren't the same", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Verification token isn't valid", HttpStatus.BAD_REQUEST);
        }
    }*/

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
        if (foundUser == null) {
            return true;
        } else {
            return false;
        }
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
        if (foundUser == null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns a VerificationToken object specified by the token
     *
     * @param verificationToken VerificationToken belonging to the user which provide the token
     * @return a VerificationToken object specified by the token
     */
    @Override
    public VerificationToken getVerificationToken(String verificationToken) {
        return this.verificationTokenRepository.findByTokenVal(verificationToken);
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

    /**
     * Creates a new VerificationToken and persists it to the database
     *
     * @param user  the user the token is assigned to
     * @param token the token itself
     */
    @Override
    public void createVerificationToken(User user, String token) {
        VerificationToken myToken = new VerificationToken(user, token);
        this.verificationTokenRepository.save(myToken);
    }

    /**
     * Returns a new VerificationToken created from an existing one
     *
     * @param existingVerificationToken the existing verification token
     * @return a new VerificationToken created from an existing one
     */
    @Override
    public VerificationToken generateNewVerificationToken(String existingVerificationToken) {
        VerificationToken verificationToken =
            this.verificationTokenRepository.findByTokenVal(existingVerificationToken);
        verificationToken.setTokenVal(UUID.randomUUID().toString());
        this.verificationTokenRepository.save(verificationToken);
        return verificationToken;
    }

    @Override
    public List<User> searchAllUsers(String search) {
        return this.userRepository.findAllByUsernameContaining(search);
    }

    @Override
    public List<VerificationToken> findAllVerificationTokens() {
        return this.verificationTokenRepository.findAll();
    }

    @Override
    public List<PasswordResetToken> findAllPasswordResetTokens() {
        return this.passwordResetTokenRepository.findAll();
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

}
