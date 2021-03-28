package no.autopacker.filedeliveryapi.controller;

import no.autopacker.filedeliveryapi.domain.OrgProjectMeta;
import org.json.JSONException;
import org.json.JSONObject;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import no.autopacker.filedeliveryapi.service.OrgProjectService;



@RequestMapping(value = "api/organization")
@RestController
public class OrgProjectController {
    private final OrgProjectService orgProjectService;


    @Autowired
    public OrgProjectController(OrgProjectService orgProjectService){
        this.orgProjectService = orgProjectService;
    }

    @PostMapping(value = "/createProject")
    public ResponseEntity<String> submitProjectToOrganization(HttpEntity<String> httpEntity) throws JSONException {

        /** KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        if (authUser != null) { */

            String body = httpEntity.getBody();
            if (body != null) {
                JSONObject jsonObject = new JSONObject(body);
                return this.orgProjectService.createProject(new OrgProjectMeta(
                        jsonObject.getLong("organizationId"),
                        jsonObject.getString("user"),
                        jsonObject.getJSONArray("authors"),
                        jsonObject.getString("name"),
                        jsonObject.getString("desc"),
                        jsonObject.getJSONArray("links"),
                        jsonObject.getJSONArray("tags")

                        )
                );
            } else {
                return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
            }
        /**} else {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        } */
    }

}
