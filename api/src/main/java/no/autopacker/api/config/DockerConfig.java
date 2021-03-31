package no.autopacker.api.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "docker")
public class DockerConfig {

    @Value("${username:default invalid username}")
    private String username;

    @Value("${token:default invalid token}")
    private String token;

    @Value("${repository:default invalid docker repository}")
    private String repository;
}
