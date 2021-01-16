package no.autopacker.userservice.config;

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

    @Value("${api.client-username}")
    private String apiClientUsername;

    @Value("${api.client-password}")
    private String apiClientPassword;

    public String getKeycloakAuthUrl() {
        return apiRootUrl + ":8443/auth";
    }

    public String getApplicationUrl() {
        return apiRootUrl;
    }

    public String getWebApplicationUrl() { return apiRootUrl; }

}
