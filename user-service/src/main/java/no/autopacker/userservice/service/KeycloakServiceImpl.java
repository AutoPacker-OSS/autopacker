package no.autopacker.userservice.service;

import no.autopacker.userservice.domain.KeycloakAdminClientConfig;
import no.autopacker.userservice.entity.User;
import no.autopacker.userservice.security.KeycloakAdminClientUtils;
import no.autopacker.userservice.security.KeycloakPropertyReader;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;
import java.util.Collections;

@Service
public class KeycloakServiceImpl {

    @Value("${keycloak.realm}")
    private String keycloakRealm;

    private final KeycloakAdminClientUtils keycloakAdminClientUtils;
    private final KeycloakPropertyReader keycloakPropertyReader;

    public KeycloakServiceImpl(
            KeycloakAdminClientUtils keycloakAdminClientUtils,
            KeycloakPropertyReader keycloakPropertyReader) {
        this.keycloakAdminClientUtils = keycloakAdminClientUtils;
        this.keycloakPropertyReader = keycloakPropertyReader;
    }

    public String createNewUser(User user, String password) {

        // Add user to database

        // Get Keycloak config
        KeycloakAdminClientConfig keycloakAdminClientConfig = this.keycloakAdminClientUtils
                .loadConfig(keycloakPropertyReader);
        // Get keycloak client
        Keycloak keycloak = this.keycloakAdminClientUtils
                .getKeycloakClient(keycloakAdminClientConfig);

        // Define user
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setEnabled(true);
        userRepresentation.setUsername(user.getUsername());
        userRepresentation.setEmail(user.getEmail());

        // Get realm
        RealmResource realmResource = keycloak.realm(keycloakRealm);
        UsersResource usersResource = realmResource.users();

        // Create user (requires manage-users role)
        Response response = usersResource.create(userRepresentation);
        String userId = CreatedResponseUtil.getCreatedId(response);

        // Define password credential
        CredentialRepresentation passwordCred = new CredentialRepresentation();
        passwordCred.setTemporary(false);
        passwordCred.setType(CredentialRepresentation.PASSWORD);
        passwordCred.setValue(password);

        UserResource userResource = usersResource.get(userId);

        // Set password credential
        userResource.resetPassword(passwordCred);

        // Get realm role "tester" (requires view-realm role)
        RoleRepresentation testerRealmRole = realmResource.roles()//
                .get("MEMBER").toRepresentation();

        // Assign realm role tester to user
        userResource.roles().realmLevel()
                .add(Collections.singletonList(testerRealmRole));

        // Request email verification
        usersResource.get(userId).executeActionsEmail(Collections.singletonList("VERIFY_EMAIL"));

        return userId;
    }

}
