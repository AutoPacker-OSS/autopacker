package no.autopacker.gatewayapi.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringGatewayConfig {

    @Bean
    public RouteLocator router(RouteLocatorBuilder builder) {
        return builder.routes()
                // API endpoint
                .route(r -> r.path("/**")
                        .and().header("Host", "api.*")
                        .uri("http://localhost:8081")
                        .id("api"))

                // Web application endpoint
                .route(r -> r.path("/**")
                        .and().header("Host", "^(?!(api)).*")
                        .uri("http://localhost:8444")
                        .id("web-app"))

                .build();
    }
}
