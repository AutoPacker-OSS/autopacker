package no.autopacker.api.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Contains configuration that is dynamically set dependent on the active profile
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "api")
public class AppConfig {

    @Value("${api.root-url}")
    private String apiRootUrl;

    @Value("${api.service-url}")
    private String serviceUrl;

    @Value("${api.keycloak-url}")
    private String keycloakUrl;

    @Value("${api.client-username}")
    private String apiClientUsername;

    @Value("${api.client-password}")
    private String apiClientPassword;

    @Value("${api.fdapi-url}")
    private String fdapiUrl;

    @Value("${fdapi.mongo.url}")
    private String fdapiMongoUrl;

    public String getRootUrl() {
        return apiRootUrl;
    }

    public String getApplicationUrl() {
        return serviceUrl;
    }

}
