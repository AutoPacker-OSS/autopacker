package no.autopacker.api.service.fdapi;

import no.autopacker.api.entity.fdapi.OrgProject;
import no.autopacker.api.repository.fdapi.OrgProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrgProjectService {

    private final OrgProjectRepository orgProjectRepository;

    @Autowired
    public OrgProjectService(OrgProjectRepository orgProjectRepository){
        this.orgProjectRepository = orgProjectRepository;
    }


    public ResponseEntity<String> createProject(OrgProject orgProject) {
        if (orgProject != null ){
           orgProjectRepository.save(orgProject);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Bad_Request", HttpStatus.BAD_REQUEST);
        }
    }

    public List<OrgProject> notSubmitted(String organization, String user){
        List<OrgProject> list = this.orgProjectRepository.findByOrganizationNameAndUser(organization, user);
        list.removeIf(OrgProject::isSubmitted);
        return list;
    }


    public ResponseEntity findProjectBasedOnId(String organization, Long id) {

        ResponseEntity response = null;
        OrgProject organizationProject = this.orgProjectRepository.findByOrganizationNameAndId(organization, id);

        if (organizationProject != null) {
            response = ResponseEntity.ok(organizationProject);
        } else {
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist.");
        }
        return response;
    }


    public ResponseEntity<String> setSubmitted(String org, Long id) {

       OrgProject orgProject = this.orgProjectRepository.findByOrganizationNameAndId(org,id);
       if (orgProject != null){
           orgProject.setSubmitted(true);
           orgProjectRepository.save(orgProject);
           return new ResponseEntity<>("OK", HttpStatus.OK);
       } else {
           return new ResponseEntity<>("Bad_Request", HttpStatus.BAD_REQUEST);
       }
    }
}

