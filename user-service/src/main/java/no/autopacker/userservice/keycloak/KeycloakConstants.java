package no.autopacker.userservice.keycloak;

import com.google.common.collect.ImmutableList;

public final class KeycloakConstants {

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_MEMBER = "MEMBER";
    public static final String ROLE_UNVERIFIED = "UNVERIFIED";
    public static final ImmutableList<String> ROLE_KEYCLOAK_DEFAULT_EXCLUDED = ImmutableList
        .of("uma_authorization", "offline_access");

}
