package no.autopacker.filedeliveryapi.service;


import no.autopacker.filedeliveryapi.domain.OrgProjectMeta;
import no.autopacker.filedeliveryapi.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


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


}
