package no.autopacker.gatewayapi.filter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

@Configuration
public class CorsFilters {

	@Bean
	public WebFilter corsFilter() {
		return (ServerWebExchange ctx, WebFilterChain chain) -> {
			ServerHttpResponse res = ctx.getResponse();
			ServerHttpRequest req = ctx.getRequest();

			HttpHeaders h = res.getHeaders();

			if (req.getMethod() == HttpMethod.OPTIONS) {
				h.add("Access-Control-Allow-Origin", "*");
				h.add("Access-Control-Allow-Methods", "*");
				h.add("Access-Control-Allow-Headers", "*");
			}

			return chain.filter(ctx);
		};
	}
}
