package no.autopacker.api.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Objects;

public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
    private final String audience;
    private final String extAudience = "https://dev-0t37hfrq.us.auth0.com/api/v2/";

    AudienceValidator(String audience) {
        Assert.hasText(audience, "audience is null or empty");
        this.audience = audience;
    }

    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        List<String> audiences = jwt.getAudience();

        // TODO jwt token audience points to auth0 not locally [i <3 php]
        if (audiences.contains(this.audience) || audiences.contains(extAudience)) {
            return OAuth2TokenValidatorResult.success();
        }
        OAuth2Error err = new OAuth2Error(OAuth2ErrorCodes.INVALID_GRANT);
        return OAuth2TokenValidatorResult.failure(err);
    }
}
