package no.autopacker.filedeliveryapi.service;


import no.autopacker.filedeliveryapi.domain.OrgProjectMeta;
import no.autopacker.filedeliveryapi.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.function.Predicate;

@Service
public class OrgProjectService {

    private final OrgProjectRepository orgProjectRepository;

    @Autowired
    public OrgProjectService(OrgProjectRepository orgProjectRepository){
        this.orgProjectRepository = orgProjectRepository;
    }


    public ResponseEntity<String> createProject(OrgProjectMeta orgProjectMeta) {
        if (orgProjectMeta != null ){
           orgProjectRepository.save(orgProjectMeta);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Bad_Request", HttpStatus.BAD_REQUEST);
        }
    }

    public List<OrgProjectMeta> notSubmitted(String organization, String user){
        List<OrgProjectMeta> list = this.orgProjectRepository.findByOrganizationNameAndUser(organization, user);
        list.removeIf(OrgProjectMeta::isSubmitted);
        return list;
    }


    public ResponseEntity findProjectBasedOnId(String organization, Long id) {

        ResponseEntity response = null;
        OrgProjectMeta organizationProject = this.orgProjectRepository.findByOrganizationNameAndId(organization, id);

        if (organizationProject != null) {
            response = ResponseEntity.ok(organizationProject);
        } else {
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist.");
        }
        return response;
    }


    public ResponseEntity<String> setSubmitted(String org, Long id) {

       OrgProjectMeta orgProjectMeta = this.orgProjectRepository.findByOrganizationNameAndId(org,id);
       if (orgProjectMeta != null){
           orgProjectMeta.setSubmitted(true);
           orgProjectRepository.save(orgProjectMeta);
           return new ResponseEntity<>("OK", HttpStatus.OK);
       } else {
           return new ResponseEntity<>("Bad_Request", HttpStatus.BAD_REQUEST);
       }
    }
}

