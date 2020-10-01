package no.autopacker.userservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Calendar;
import java.util.List;
import no.autopacker.userservice.entity.User;
import no.autopacker.userservice.entity.VerificationToken;
import no.autopacker.userservice.service.KeycloakAdminClientService;
import no.autopacker.userservice.userinterface.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

/**
 * Controls all REST endpoints
 */
@RestController
@RequestMapping(value = "api/auth")
@CrossOrigin(origins = "*")
public class RESTController {

    private final UserService userService;
    private final KeycloakAdminClientService keycloakAdminClientService;
    private ObjectMapper objectMapper;

    @Autowired
    public RESTController(UserService userService,
        KeycloakAdminClientService keycloakAdminClientService,
        ObjectMapper objectMapper) {
        this.userService = userService;
        this.keycloakAdminClientService = keycloakAdminClientService;
        this.objectMapper = objectMapper;
    }

    // TODO Add default role to user, probably add in keycloak server
    /**
     * Retrieves a register request containing HttpEntity which has the body containing the user
     * information for creating a new user
     *
     * @param httpEntity represents an HTTP request entity, consisting of headers and body
     * @param request    generic web request interceptor, giving access to general request metadata
     * @return OK if registration succeeds, and BAD_REQUEST which descriptive message if not
     */
    @PostMapping(value = "/register")
    public ResponseEntity<String> register(HttpEntity<String> httpEntity, WebRequest request) {
        // Get request body
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            try {
                this.keycloakAdminClientService.createNewUser(
                    new User(
                        jsonObject.getString("username"),
                        jsonObject.getString("email")),
                    jsonObject.getString("password"));
                return ResponseEntity.ok("Success");
            } catch (TransactionSystemException tse) {
                return new ResponseEntity<>("Email address not valid", HttpStatus.BAD_REQUEST);
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Resend a new verification token when requested
     *
     * @return OK if successfully sends a new verification token with email
     */
    @GetMapping(value = "/resendVerificationToken")
    public ResponseEntity<String> resendVerificationToken() {
        return this.userService.resendVerificationToken();
    }

    /**
     * Resend a new verification token when requested
     *
     * @return OK if successfully sends a new verification token with email
     */
    @GetMapping(value = "/requestNewVerificationToken")
    public ResponseEntity<String> resendVerificationToken(@RequestParam("token") String oldToken) {
        return this.userService.resendVerificationToken(oldToken);
    }

    /**
     * Retrieves a registration confirmation request containing the verification token as parameter.
     * If the verification token exists and is valid the user is verified. If not the user will get a
     * response of BAD_REQUEST containing the message in which why it failed
     *
     * @param request generic web request interceptor, giving access to general request metadata
     * @param token   the verification token linked to the user that wants to be verified
     * @return OK if verification is successful, and BAD_REQUEST with descriptive message if not
     */
    @GetMapping(value = "/registrationConfirmation")
    public ResponseEntity<String> confirmRegistration(
        WebRequest request, @RequestParam("token") String token) {

        VerificationToken verificationToken = this.userService.getVerificationToken(token);
        if (verificationToken == null) {
            return new ResponseEntity<>("Verification token doesn't exist", HttpStatus.BAD_REQUEST);
        }

        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            return new ResponseEntity<>("Verification token has expired", HttpStatus.BAD_REQUEST);
        }

        //user.setVerified(true);
        //user.setRole(this.roleRepository.findByName("MEMBER"));
        this.userService.updateUser(user);
        return new ResponseEntity<>("Verification success", HttpStatus.OK);
    }

    /** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Performs a reset password request which sends an email to the specified email containing a *
     * token that can be used to reset the users' password
     *
     * @param email the users' email
     * @return OK if reset password token is sent successfully and BAD_REQUEST if not
     */
    /*@GetMapping(value = "/resetPasswordRequest")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email) {
        return this.userService.resetPassword(email);
    }*/

    /** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Performs a reset password change which takes in the reset password token for verification and the
     * new password that the user wants to set
     *
     * @param httpEntity represents an HTTP request entity, consisting of headers and body
     * @return OK if password is successfully changed for the given user and BAD_REQUEST if not
     */
    /*@PostMapping(value = "/resetPasswordChange")
    public ResponseEntity<String> resetPasswordChange(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.userService.resetPasswordChange(
                jsonObject.getString("token"),
                jsonObject.getString("password"),
                jsonObject.getString("password2"));
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }*/

    /** TODO THIS LOGIC HAS TO BE CHANGED AS THE PASSWORD IS NOW HANDLED BY THE KEYCLOAK SERVER
     * Performs a password change when requested.
     *
     * @param httpEntity represents an HTTP request entity, consisting of headers and body
     * @return OK if password is successfully changed and BAD_REQUEST if not
     */
    /*@PutMapping(value = "/changePassword")
    public ResponseEntity<String> changePassword(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.userService.changePassword(
                jsonObject.getString("oldPassword"),
                jsonObject.getString("newPassword"),
                jsonObject.getString("confirmPassword"));
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }*/

    /**
     * Checks if the username is available
     *
     * @param username the username to check
     * @return OK if the username is available and BAD_REQUEST if not
     */
    @GetMapping(value = "/usernameAvailability/{username}")
    public ResponseEntity<String> validateUsername(@PathVariable("username") String username) {
        if (this.userService.validateUsername(username)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Checks if the email is available
     *
     * @param email the email to check
     * @return OK if the email is available and BAD_REQUEST if not
     */
    @GetMapping(value = "/emailAvailability/{email}")
    public ResponseEntity<String> validateEmail(@PathVariable("email") String email) {
        if (this.userService.validateEmail(email)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * The purpose of this method is just for testing that the users are where they are. Will be
     * deleted later
     */
    @GetMapping(value = "/users")
    public ResponseEntity<String> findAllUsers() {
        List<User> list = this.userService.findAllUsers();
        try {
            return new ResponseEntity<>(this.objectMapper.writeValueAsString(list), HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing users", HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping(value = "/search")
    public ResponseEntity<String> searchUsers(@RequestParam("q") String query) {
        try {
            if (query.trim().equals("")) {
                return new ResponseEntity<>(this.objectMapper.writeValueAsString(this.userService.findAllUsers()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(this.objectMapper.writeValueAsString(this.userService.searchAllUsers(query)), HttpStatus.OK);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing users", HttpStatus.BAD_REQUEST);
        }
    }

}
