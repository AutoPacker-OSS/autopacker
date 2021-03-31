package no.autopacker.api.security;

import no.autopacker.api.config.AppConfig;
import no.autopacker.api.domain.KeycloakAdminClientConfig;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakAdminClientUtils {

    private static final Logger log = LoggerFactory.getLogger(KeycloakAdminClientUtils.class);

    private final AppConfig appConfig;

    @Autowired
    public KeycloakAdminClientUtils(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    /**
     * Loads the keycloak configuration from system property.
     *
     * @return keycloak configuration
     * @see KeycloakAdminClientConfig
     */
    public KeycloakAdminClientConfig loadConfig(
        KeycloakPropertyReader keycloakPropertyReader) {

        KeycloakAdminClientConfig.KeycloakAdminClientConfigBuilder builder = KeycloakAdminClientConfig
            .builder();

        try {
            String keycloakServer = System.getProperty("keycloak.url");
            if (!StringUtils.isBlank(keycloakServer)) {
                builder = builder.serverUrl(keycloakServer);
            } else {
                builder = builder
                    .serverUrl(keycloakPropertyReader.getProperty("keycloak.auth-server-url"));
            }

            String realm = System.getProperty("keycloak.realm");
            if (!StringUtils.isBlank(realm)) {
                builder = builder.realm(realm);
            } else {
                builder = builder.realm(keycloakPropertyReader.getProperty("keycloak.realm"));
            }

            String clientId = System.getProperty("keycloak.clientId");
            if (!StringUtils.isBlank(clientId)) {
                builder = builder.clientId(clientId);
            } else {
                builder = builder.clientId(keycloakPropertyReader.getProperty("keycloak.resource"));
            }

            String clientSecret = System.getProperty("keycloak.secret");
            if (!StringUtils.isBlank(clientSecret)) {
                builder = builder.clientSecret(clientSecret);
            } else {
                builder = builder
                    .clientSecret(keycloakPropertyReader.getProperty("keycloak.credentials.secret"));
            }

        } catch (Exception e) {
            log.error("Error: Loading keycloak admin configuration => {}", e.getMessage());
        }

        KeycloakAdminClientConfig config = builder.build();
        log.debug("Found keycloak configuration: {}", config);

        return config;
    }

    /**
     * It builds a {@link Keycloak} client from a given configuration. This client is used to
     * communicate with the Keycloak instance via REST API.
     *
     * @param config  keycloak configuration
     * @return Keycloak instance
     * @see Keycloak
     * @see KeycloakAdminClientConfig
     */
    public Keycloak getKeycloakClient(KeycloakAdminClientConfig config) {

        return KeycloakBuilder.builder()
            .serverUrl(config.getServerUrl())
            .realm(config.getRealm())
            .grantType(OAuth2Constants.PASSWORD)
            .clientId(config.getClientId())
            .clientSecret(config.getClientSecret())
            .username(this.appConfig.getApiClientUsername())
            .password(this.appConfig.getApiClientPassword())
            .build();

        // TODO This might be a better solution? (using authorization token)
        //  return KeycloakBuilder.builder()
        //    .serverUrl(config.getServerUrl())
        //    .realm(config.getRealm())
        //    .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
        //    .clientId(config.getClientId())
        //    .clientSecret(config.getClientSecret())
        //    .authorization(session.getTokenString())
        //     .build();
    }


}
