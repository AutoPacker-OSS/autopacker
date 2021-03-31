package no.autopacker.userservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import no.autopacker.userservice.entity.User;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controls all REST endpoints
 */
@RestController
@RequestMapping(value = "api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserController(UserService userService,
                          ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

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
                return this.userService.createNewUser(
                    new User(
                        jsonObject.getString("username"),
                        jsonObject.getString("email")),
                    jsonObject.getString("password"),
                    request.getLocale());
            } catch (TransactionSystemException tse) {
                return new ResponseEntity<>("Email address not valid", HttpStatus.BAD_REQUEST);
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

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

    @PostMapping(value = "/upload")
    public ResponseEntity<String> uploadProfileImage(HttpEntity<String> httpEntity) {
        // Get request body
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.userService.uploadProfileImage(jsonObject.getString("image"));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
