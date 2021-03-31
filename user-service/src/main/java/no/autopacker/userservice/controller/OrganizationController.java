package no.autopacker.userservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

import no.autopacker.userservice.entity.organization.*;
import no.autopacker.userservice.repository.organization.*;
import no.autopacker.userservice.service.OrganizationService;
import org.json.JSONObject;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "api/organization")
public class OrganizationController {

    private final OrganizationService organizationService;
    private ObjectMapper objectMapper;

    // Repositories
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberApplicationRepository memberApplicationRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public OrganizationController(ProjectApplicationRepository projectApplicationRepository,
                                  MemberApplicationRepository memberApplicationRepository,
                                  OrganizationRepository organizationRepository,
                                  OrganizationProjectRepository projectRepository,
                                  MemberRepository memberRepository,
                                  RoleRepository roleRepository,
                                  OrganizationService organizationService) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.memberApplicationRepository = memberApplicationRepository;
        this.organizationRepository = organizationRepository;
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
        this.roleRepository = roleRepository;
        this.organizationService = organizationService;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping(value = "/new-organization")
    public ResponseEntity<String> createNewOrg(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
           return this.organizationService.createNewOrg( new Organization(
                   jsonObject.getString("orgName"),
                   jsonObject.getString("orgDesc"),
                   jsonObject.getString("url"),
                   jsonObject.getBoolean ("isPublic")),

                   jsonObject.getString("username"),
                   jsonObject.getString("email"),
                   jsonObject.getString("name"),
                   this.roleRepository.findByName(jsonObject.getString("role"))
            );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }


    }


    @PostMapping(value = "/requestMembership")
    public ResponseEntity<String> requestMembership(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.requestMembership(new Member(
                    this.organizationRepository.findByName(jsonObject.getString("organizationName")),
                    this.roleRepository.findByName(jsonObject.getString("role")),
                    jsonObject.getString("username"),
                    jsonObject.getString("name"),
                    jsonObject.getString("email")
            ), jsonObject.getString("comment"));
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/submitProject")
    public ResponseEntity<String> submitProjectToOrganization(HttpEntity<String> httpEntity) {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (authUser != null) {
            String body = httpEntity.getBody();
            if (body != null) {
                JSONObject jsonObject = new JSONObject(body);
                return this.organizationService.submitProjectToOrganization(
                        new OrganizationProject(
                                this.organizationRepository.findByName(jsonObject.getString("organizationName")),
                                this.memberRepository.findByUsernameIgnoreCaseAndIsEnabledIsTrue(authUser.getKeycloakSecurityContext().getToken().getPreferredUsername()),
                                jsonObject.getJSONArray("authors"),
                                jsonObject.getLong("actualProject"),
                                jsonObject.getString("projectName"),
                                jsonObject.getString("type"),
                                jsonObject.getString("desc"),
                                jsonObject.getJSONArray("links"),
                                jsonObject.getJSONArray("tags")
                        ), jsonObject.getString("comment")
                );
            } else {
                return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(value = "/updateProjectSubmission")
    public ResponseEntity<String> updateProjectSubmission(HttpEntity<String> httpEntity) {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();

        if (authenticatedUser != null) {
            String body = httpEntity.getBody();
            if (body != null) {
                JSONObject jsonObject = new JSONObject(body);
                return this.organizationService.updateProjectSubmission(
                        new OrganizationProject(
                                this.organizationRepository.findByName(jsonObject.getString("organizationName")),
                                this.memberRepository.findByUsernameIgnoreCaseAndIsEnabledIsTrue(authenticatedUser.getKeycloakSecurityContext().getToken().getPreferredUsername()),
                                jsonObject.getJSONArray("authors"),
                                0L, // Dummy id, this won't get used
                                jsonObject.getString("projectName"),
                                jsonObject.getString("type"),
                                jsonObject.getString("desc"),
                                jsonObject.getJSONArray("links"),
                                jsonObject.getJSONArray("tags")
                        ), jsonObject.getString("comment"), jsonObject.getLong("projectId")
                );
            } else {
                return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(value = "/acceptMemberRequest")
    public ResponseEntity<String> acceptMemberApplication(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.acceptMemberRequest(
                    jsonObject.getString("organizationName"),
                    jsonObject.getString("username")
            );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/declineMemberRequest")
    public ResponseEntity<String> declineMemberApplication(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.declineMemberRequest(
                    jsonObject.getString("organizationName"),
                    jsonObject.getString("username"),
                    jsonObject.getString("comment")
            );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    /*------------------------------
    Project request related
    ----------------------------*/

    @PostMapping(value = "/acceptProjectRequest")
    public ResponseEntity<String> acceptProjectRequest(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.acceptProjectRequest(
                    jsonObject.getLong("projectRequestId"),
                    jsonObject.getString("comment")
            );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/declineProjectRequest")
    public ResponseEntity<String> declineProjectRequest(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.declineProjectRequest(
                    jsonObject.getString("organizationName"),
                    jsonObject.getLong("projectRequestId"),
                    jsonObject.getString("comment")
            );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    /*------------------------------
    RoleControl
    ----------------------------*/
    @PostMapping(value = "/changeRole")
    public ResponseEntity<String> changeRole(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.changeRole(
                    jsonObject.getString("orgName"),
                    jsonObject.getString("user"),
                    this.roleRepository.findByName(jsonObject.getString("role"))
                    );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping(value = "/deleteMember")
    public ResponseEntity<String> deleteMember(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.deleteMember(
                    jsonObject.getString("orgName"),
                    jsonObject.getString("user")
            );
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }


    /*------------------------------
    Getters for returning all data
    ----------------------------*/

    @GetMapping(value = "/{organization}/members")
    public List<Member> findAllMembers(@PathVariable("organization") String organization) {
        return this.memberRepository.findAllByOrganization_NameAndIsEnabledIsTrue(organization);
    }

    @GetMapping
    public List<Organization> findAllOrganizations() {
        return this.organizationRepository.findAll();
    }

    @GetMapping(value = "/{organization}")
    public ResponseEntity<String> findOrganization(@PathVariable("organization") String organization) {
        if (organization.trim().equals("")) {
            return new ResponseEntity<>("Organization name can't be empty?", HttpStatus.BAD_REQUEST);
        } else {
            try {
                return new ResponseEntity<>(
                        this.objectMapper.writeValueAsString(
                                this.organizationRepository.findByName(organization)
                        ), HttpStatus.OK
                );
            } catch (JsonProcessingException e) {
                return new ResponseEntity<>("Something went wrong while parsing organization", HttpStatus.BAD_REQUEST);
            }
        }
    }

    /**
     * Checks if a user is part of a specific organization
     *
     * @param organization the organization to check if the user is member of
     * @param username the username of the user to check
     * @return HTTP OK if the user is part of the organization and HTTP BAD REQUEST if not
     */
    @GetMapping(value = "/{organization}/{username}/isMember")
    public boolean checkIfUserIsPartOfAnOrganization(@PathVariable("organization") String organization,
                                                                    @PathVariable("username") String username) {
        Member foundMember = this.memberRepository
            .findByOrganization_NameAndUsername(organization, username);
        if (foundMember != null) {
            return true;
        } else {
            return false;
        }
    }

    @GetMapping(value = "/{username}/isMember")
    public ResponseEntity<String> findAllOrganizationsAUserIsMemberIn(@PathVariable("username") String username) {
        List<Organization> list = this.organizationRepository.findOrganizationsByMembersUsernameAndMembersIsEnabled(username, true);
        try {
            return new ResponseEntity<>(this.objectMapper.writeValueAsString(list), HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing organization", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/{username}/isMember/search")
    public ResponseEntity<String> searchAllOrganizationsAUserIsMemberIn(@PathVariable("username") String username,
                                                                        @RequestParam("q") String query) {
        List<Organization> list = this.organizationRepository.findOrganizationsByMembersUsernameAndMembersIsEnabledAndNameContaining(username, true, query);
        try {
            return new ResponseEntity<>(this.objectMapper.writeValueAsString(list), HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing organization", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/{organization}/projects")
    public List<OrganizationProject> findAllProjects(@PathVariable("organization") String organization) {
        return this.projectRepository.findAllByOrganization_NameAndIsAcceptedIsTrue(organization);
    }

    @GetMapping(value = "/{organization}/projects/search")
    public ResponseEntity<String> searchOrganizationProjects(@PathVariable("organization") String organization,
                                                    @RequestParam("q") String query) {
        try {
            if (query.trim().equals("")) {
                return new ResponseEntity<>(this.objectMapper.writeValueAsString(this.projectRepository.findAllByOrganization_NameAndIsAcceptedIsTrue(organization)), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(this.objectMapper.writeValueAsString(this.projectRepository.findAllByOrganization_NameAndAndNameContainingIgnoreCaseAndIsAcceptedIsTrue(organization, query)), HttpStatus.OK);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing projects", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/search")
    public ResponseEntity<String> searchAllOrganizations(@RequestParam("q") String query) {
        List<Organization> list = this.organizationRepository.findAllByNameContaining(query);
        try {
            return new ResponseEntity<>(this.objectMapper.writeValueAsString(list), HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing organizations", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/{organization}/member-applications")
    public List<MemberApplication> findAllMemberApplications(@PathVariable("organization") String organization) {
        return this.memberApplicationRepository.findAllByOrganization_NameAndIsAcceptedIsFalse(organization);
    }

    @GetMapping(value = "/{organization}/project-applications")
    public List<ProjectApplication> findAllprojectApplications(@PathVariable("organization") String organization) {
        return this.projectApplicationRepository.findAllByOrganization_NameAndIsAcceptedIsFalse(organization);
    }

    @GetMapping(value = "/{organization}/project-applications/{username}")
    public List<ProjectApplication> findAllprojectApplications(@PathVariable("organization") String organization,
                                                               @PathVariable("username") String username) {
        return this.projectApplicationRepository.findAllByOrganization_NameAndMember_UsernameAndIsAcceptedIsFalse(organization, username);
    }

    @GetMapping(value = "/{organization}/delete-project-application/{projectId}")
    public ResponseEntity<String> deleteProjectRequest(@PathVariable("organization") String organization,
                                                       @PathVariable("projectId") Long projectId) {
        ProjectApplication projectApplication = this.projectApplicationRepository.findByOrganization_NameAndOrganizationProject_IdAndIsAcceptedIsFalse(organization, projectId);
        if (projectApplication != null) {
            this.projectApplicationRepository.deleteById(projectApplication.getId());
            this.projectRepository.deleteById(projectId);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("foobar", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/{organization}/overview/{projectId}")
    public ResponseEntity getOrgProjectDetails(@PathVariable("organization") String organization,
                                               @PathVariable("projectId") Long projectId) {
        ResponseEntity response = null;
        OrganizationProject organizationProject = this.projectRepository.findByOrganization_NameAndId(organization, projectId);

        if (organizationProject != null) {
            response = ResponseEntity.ok(organizationProject);
        } else {
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist.");
        }
        return response;
    }

}
