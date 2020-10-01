package no.autopacker.servermanager.config;

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

    public String getApplicationUrl() {
        return apiRootUrl + ":8082";
    }

    public String getFileDeliveryAPIApplicationUrl() {
        return apiRootUrl + ":8090";
    }

}