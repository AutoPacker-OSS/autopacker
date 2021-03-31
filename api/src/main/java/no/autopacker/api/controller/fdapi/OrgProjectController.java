package no.autopacker.api.controller.fdapi;

import no.autopacker.api.domain.OrgProjectMeta;
import no.autopacker.api.repository.fdapi.OrgProjectRepository;
import no.autopacker.api.service.fdapi.OrgProjectService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping(value = "/organization")
@RestController
public class OrgProjectController {
    private final OrgProjectService orgProjectService;
    private final OrgProjectRepository orgProjectRepository;


    @Autowired
    public OrgProjectController(OrgProjectService orgProjectService, OrgProjectRepository orgProjectRepository){
        this.orgProjectService = orgProjectService;
        this.orgProjectRepository = orgProjectRepository;
    }

    @PostMapping(value = "/createProject")
    public ResponseEntity<String> submitProjectToOrganization(HttpEntity<String> httpEntity) throws JSONException {
            String body = httpEntity.getBody();
            if (body != null) {
                JSONObject jsonObject = new JSONObject(body);
                return this.orgProjectService.createProject(new OrgProjectMeta(
                        jsonObject.getString("organizationName"),
                        jsonObject.getString("user"),
                        jsonObject.getJSONArray("authors"),
                        jsonObject.getString("name"),
                        jsonObject.getString("desc"),
                        jsonObject.getString("links"),
                        jsonObject.getJSONArray("tags")
                        )
                );
            } else {
                return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
            }
    }

    @GetMapping(value = "/{organization}/projects/{user}")
    public List<OrgProjectMeta> findAllPersonalProjectsNotSubmitted(@PathVariable("organization") String organization,
                                                        @PathVariable("user") String user) {
       return  this.orgProjectService.notSubmitted( organization, user);
    }

    @GetMapping(value = "/{organization}/projectId/{id}")
    public ResponseEntity findProjectBasedOnId(@PathVariable("organization") String organization,
                                               @PathVariable("id") Long id) {
        return  this.orgProjectService.findProjectBasedOnId( organization, id);
    }

    @PostMapping(value = "/submitted")
    public ResponseEntity<String> findProjectBasedOnId(HttpEntity<String> httpEntity) throws JSONException {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            Long id = jsonObject.getLong("projectId");
            String org = jsonObject.getString("organizationName");
        this.orgProjectService.setSubmitted(org,  id);
                return new ResponseEntity<>("Set submitted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

}
