package no.autopacker.userservice;

import java.util.Collections;
import javax.ws.rs.core.Response;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

/**
 * This class holds some examples on how to interact with Keycloak server using an admin client. In
 * this scenario, we can create a user, assign a password, assign roles and perform email actions.
 */
public class KeycloakAdminClientTest {

    public static void main(String[] args) {
        String serverUrl = "http://localhost:9090/auth";
        String realm = "AutoPackerRealm";
        // idm-client needs to allow "Direct Access Grants: Resource Owner Password Credentials Grant"
        String clientId = "resource-server";
        String clientSecret = "f47fb710-be7f-4e10-b6a6-dfcf14f72ec4";

//		// Client "idm-client" needs service-account with at least "manage-users, view-clients, view-realm, view-users" roles for "realm-management"
//		Keycloak keycloak = KeycloakBuilder.builder() //
//				.serverUrl(serverUrl) //
//				.realm(realm) //
//				.grantType(OAuth2Constants.CLIENT_CREDENTIALS) //
//				.clientId(clientId) //
//				.clientSecret(clientSecret).build();

        // User "idm-admin" needs at least "manage-users, view-clients, view-realm, view-users" roles for "realm-management"
        Keycloak keycloak = KeycloakBuilder.builder() //
            .serverUrl(serverUrl) //
            .realm(realm) //
            .grantType(OAuth2Constants.PASSWORD) //
            .clientId(clientId) //
            .clientSecret(clientSecret) //
            .username("userservice") //
            .password(
                "xYruVpW#!h8WDDp%ed8R8BWi&mDzVfPF!4XAwoLVekUuzUW84jG^fQc6nxR#@&@jr8#PUFvZJK7*#Xk%VUx#7POlO^riD6fXIhX") //
            .build();

        // Define user
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername("foobar");
        user.setFirstName("Foo");
        user.setLastName("Bar");
        user.setEmail("foobar@example.com");
        user.setAttributes(Collections.singletonMap("origin", Collections.singletonList("demo")));

        // Get realm
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        // Create user (requires manage-users role)
        Response response = usersResource.create(user);
        System.out.printf("Repsonse: %s %s%n", response.getStatus(), response.getStatusInfo());
        System.out.println(response.getLocation());
        String userId = CreatedResponseUtil.getCreatedId(response);

        System.out.printf("User created with userId: %s%n", userId);

        // Define password credential
        CredentialRepresentation passwordCred = new CredentialRepresentation();
        passwordCred.setTemporary(false);
        passwordCred.setType(CredentialRepresentation.PASSWORD);
        passwordCred.setValue("test");

        UserResource userResource = usersResource.get(userId);

        // Set password credential
        userResource.resetPassword(passwordCred);

//        // Get realm role "tester" (requires view-realm role)
        RoleRepresentation testerRealmRole = realmResource.roles()//
            .get("UNVERIFIED").toRepresentation();
//
//        // Assign realm role tester to user
        userResource.roles().realmLevel() //
            .add(Collections.singletonList(testerRealmRole));
//
//        // Get client
        ClientRepresentation app1Client = realmResource.clients() //
            .findByClientId("resource-server").get(0);
//
//        // Get client level role (requires view-clients role)
        RoleRepresentation userClientRole = realmResource.clients().get(app1Client.getId()) //
            .roles().get("USER").toRepresentation();
//
//        // Assign client level role to user
        userResource.roles() //
            .clientLevel(app1Client.getId()).add(Collections.singletonList(userClientRole));

        // Send password reset E-Mail
        // VERIFY_EMAIL, UPDATE_PROFILE, CONFIGURE_TOTP, UPDATE_PASSWORD, TERMS_AND_CONDITIONS
//        usersRessource.get(userId).executeActionsEmail(Arrays.asList("UPDATE_PASSWORD"));

        // Delete User
//        userResource.remove();
    }

}
