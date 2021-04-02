package no.autopacker.api.utils;

import lombok.Data;
import no.autopacker.api.entity.User;
import no.autopacker.api.entity.organization.Organization;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Contains information from an HTTP request to an organization endpoint which requires authentication
 */
@Data
public class OrgAuthInfo {
    private User user ;
    private Organization organization;
    private String errorMessage;
    private HttpStatus status;
    private JSONObject json;

    public boolean hasError() {
        return errorMessage != null;
    }

    public OrgAuthInfo setError(String errorMessage, HttpStatus status) {
        this.errorMessage = errorMessage;
        this.status = status;
        return this;
    }

    public ResponseEntity<String> createHttpResponse() {
        if (errorMessage != null && status != null) {
            return new ResponseEntity<>(errorMessage, status);
        } else {
            return null;
        }
    }
}
