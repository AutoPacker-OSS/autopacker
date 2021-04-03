package no.autopacker.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import no.autopacker.api.entity.User;
import no.autopacker.api.entity.fdapi.Project;
import no.autopacker.api.entity.organization.*;
import no.autopacker.api.repository.UserRepository;
import no.autopacker.api.repository.fdapi.ProjectRepository;
import no.autopacker.api.repository.organization.*;
import no.autopacker.api.service.OrganizationService;
import no.autopacker.api.interfaces.UserService;
import no.autopacker.api.utils.OrgAuthInfo;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static no.autopacker.api.security.AuthConstants.ROLE_ADMIN;

@RestController
@RequestMapping(value = "api/organization")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final ObjectMapper objectMapper;

    // Repositories
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberApplicationRepository memberApplicationRepository;
    private final OrganizationRepository organizationRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public OrganizationController(ProjectApplicationRepository projectApplicationRepository,
                                  MemberApplicationRepository memberApplicationRepository,
                                  OrganizationRepository organizationRepository,
                                  OrganizationService organizationService,
                                  UserService userService,
                                  UserRepository userRepository,
                                  ProjectRepository projectRepository) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.memberApplicationRepository = memberApplicationRepository;
        this.organizationRepository = organizationRepository;
        this.organizationService = organizationService;
        this.projectRepository = projectRepository;
        this.objectMapper = new ObjectMapper();
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/new-organization")
    public ResponseEntity<String> createNewOrg(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.createNewOrg(
                    jsonObject.getString("organizationName"),
                    jsonObject.getString("orgDesc"),
                    jsonObject.getString("username"),
                    jsonObject.getString("url"),
                    jsonObject.getBoolean("isPublic"));
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping(value = "/requestMembership")
    public ResponseEntity<String> requestMembership(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.organizationService.requestMembership(
                    jsonObject.getString("username"),
                    jsonObject.getString("organizationName"),
                    jsonObject.getString("role"),
                    jsonObject.getString("comment"));
        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/submitProject")
    public ResponseEntity<String> submitProjectToOrganization(HttpEntity<String> httpEntity) {
        User authUser = userService.getAuthenticatedUser();
        if (authUser != null) {
            String body = httpEntity.getBody();
            if (body != null) {
                JSONObject jsonObject = new JSONObject(body);
                return organizationService.submitProjectToOrganization(
                        jsonObject.getString("organizationName"),
                        jsonObject.getLong("projectId"),
                        jsonObject.getString("comment"));
            } else {
                return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }

    // TODO - this should be handled in ProjectController?
//    @PostMapping(value = "/updateProjectSubmission")
//    public ResponseEntity<String> updateProjectSubmission(HttpEntity<String> httpEntity) {
//        User authUser = userService.getAuthenticatedUser();
//
//        if (authUser != null) {
//            String body = httpEntity.getBody();
//            if (body != null) {
//                JSONObject jsonObject = new JSONObject(body);
//                return this.organizationService.updateProjectSubmission(
//                        new OrganizationProject(
//                                this.organizationRepository.findByName(jsonObject.getString("organizationName")),
//                                this.memberRepository.findByUsernameIgnoreCaseAndIsEnabledIsTrue(authUser.getUsername()),
//                                jsonObject.getJSONArray("authors"),
//                                0L, // Dummy id, this won't get used
//                                jsonObject.getString("projectName"),
//                                jsonObject.getString("type"),
//                                jsonObject.getString("desc"),
//                                jsonObject.getJSONArray("links"),
//                                jsonObject.getJSONArray("tags")
//                        ), jsonObject.getString("comment"), jsonObject.getLong("projectId")
//                );
//            } else {
//                return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
//            }
//        } else {
//            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
//        }
//    }

    @PostMapping(value = "/acceptMemberRequest")
    public ResponseEntity<String> acceptMemberApplication(HttpEntity<String> httpEntity) {
        OrgAuthInfo authInfo = checkOrgAuthorization(httpEntity);
        if (authInfo.hasError()) return authInfo.createHttpResponse();
        return this.organizationService.acceptOrDeclineMemberRequest(authInfo.getOrganization(),
                authInfo.getJson().getString("username"), true);
    }

    @PostMapping(value = "/declineMemberRequest")
    public ResponseEntity<String> declineMemberApplication(HttpEntity<String> httpEntity) {
        OrgAuthInfo authInfo = checkOrgAuthorization(httpEntity);
        if (authInfo.hasError()) return authInfo.createHttpResponse();
        return this.organizationService.acceptOrDeclineMemberRequest(authInfo.getOrganization(),
                authInfo.getJson().getString("username"), false);
    }

    /*------------------------------
    Project request related
    ----------------------------*/

    @PostMapping(value = "/acceptProjectRequest")
    public ResponseEntity<String> acceptProjectRequest(HttpEntity<String> httpEntity) {
        OrgAuthInfo authInfo = checkOrgAuthorization(httpEntity);
        if (authInfo.hasError()) return authInfo.createHttpResponse();
        return organizationService.acceptOrDeclineProjectRequest(
                authInfo.getJson().getLong("projectRequestId"), authInfo.getUser(),
                authInfo.getOrganization(), authInfo.getJson().getString("comment"), true);
    }

    @PostMapping(value = "/declineProjectRequest")
    public ResponseEntity<String> declineProjectRequest(HttpEntity<String> httpEntity) {
        OrgAuthInfo authInfo = checkOrgAuthorization(httpEntity);
        if (authInfo.hasError()) return authInfo.createHttpResponse();
        return organizationService.acceptOrDeclineProjectRequest(
                authInfo.getJson().getLong("projectRequestId"), authInfo.getUser(),
                authInfo.getOrganization(), authInfo.getJson().getString("comment"), false);
    }

    /**
     * Checks whether the currently authenticated user has admin access to the specified organization.
     * Returns a structure which will contain an error if something is wrong
     * Used to avoid duplicate code.
     *
     * @param httpEntity HTTP entity containing the body
     * @return An object which contains error message if something is wrong
     */
    public OrgAuthInfo checkOrgAuthorization(HttpEntity<String> httpEntity) {
        OrgAuthInfo info = new OrgAuthInfo();
        User authUser = userService.getAuthenticatedUser();
        if (authUser == null) return info.setError("Not authorized", HttpStatus.UNAUTHORIZED);
        info.setUser(authUser);

        String body = httpEntity.getBody();
        String organizationName = null;
        if (body == null) return info.setError("Body can't be null", HttpStatus.BAD_REQUEST);
        try {
            JSONObject jsonObject = new JSONObject(body);
            info.setJson(jsonObject);
            organizationName = jsonObject.getString("organizationName");
        } catch (JSONException e) {
            info.setError("Wrong JSON data format", HttpStatus.BAD_REQUEST);
        }
        Organization organization = organizationRepository.findByName(organizationName);
        if (organization == null) return info.setError("Organization not found", HttpStatus.NOT_FOUND);
        info.setOrganization(organization);
        if (!isOrganizationAdmin(authUser, organization)) {
            return info.setError("Not authorized", HttpStatus.UNAUTHORIZED);
        }
        return info;
    }


    /**
     * Check if the specified user has admin access to the organization.
     * Note: users who are system admins are also admins of all organizations!
     *
     * @param user         User to check
     * @param organization Organization which will be accessed
     * @return True when the user is organization's admin, false otherwise
     */
    private boolean isOrganizationAdmin(User user, Organization organization) {
        return user.hasSystemRole(ROLE_ADMIN) || organization.hasAdminMember(user);
    }

    /*------------------------------
    RoleControl
    ----------------------------*/
    @PostMapping(value = "/changeRole")
    public ResponseEntity<String> changeRole(HttpEntity<String> httpEntity) {
        OrgAuthInfo info = checkOrgAuthorization(httpEntity);
        if (info.hasError()) return info.createHttpResponse();
        return this.organizationService.changeRole(info.getOrganization(), info.getJson().getString("username"),
                info.getJson().getString("role"));
    }

    @PostMapping(value = "/deleteMember")
    public ResponseEntity<String> deleteMember(HttpEntity<String> httpEntity) {
        OrgAuthInfo info = checkOrgAuthorization(httpEntity);
        if (info.hasError()) return info.createHttpResponse();
        return this.organizationService.deleteMember(info.getOrganization(), info.getJson().getString("username"));
    }


    /*------------------------------
    Getters for returning all data
    ----------------------------*/

    @GetMapping(value = "/{organization}/members")
    public List<Member> findAllMembers(@PathVariable("organization") String organizationName) {
        Organization organization = organizationRepository.findByName(organizationName);
        return organization != null ? organization.getMembers() : new LinkedList<>();
    }

    @GetMapping
    public List<Organization> findAllOrganizations() {
        return this.organizationRepository.findAll();
    }

    @GetMapping(value = "/{organization}")
    public ResponseEntity<String> findOrganization(@PathVariable("organization") String organizationName) {
        Organization organization = organizationRepository.findByName(organizationName);
        if (organization == null) {
            return new ResponseEntity<>("Organization not found", HttpStatus.BAD_REQUEST);
        }
        try {
            return new ResponseEntity<>(this.objectMapper.writeValueAsString(organization), HttpStatus.OK);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>("Something went wrong while parsing organization", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Checks if a user is part of a specific organization
     *
     * @param organizationName Name of the organization to check if the user is member of
     * @param username         the username of the user to check
     * @return HTTP OK if the user is part of the organization and HTTP BAD REQUEST if not
     */
    @GetMapping(value = "/{organization}/{username}/isMember")
    public ResponseEntity<String> checkIfUserIsPartOfAnOrganization(@PathVariable("organization") String organizationName,
                                                                    @PathVariable("username") String username) {
        boolean isMember = organizationService.isOrgMemberOf(userRepository.findByUsername(username),
                organizationRepository.findByName(organizationName));
        return new ResponseEntity<>("", isMember ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/{username}/isMember")
    public List<Organization> findAllOrganizationsAUserIsMemberIn(@PathVariable("username") String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? user.getAllOrganizations() : new LinkedList<>();
    }

    @GetMapping(value = "/{username}/isMember/search")
    public List<Organization> searchAllOrganizationsAUserIsMemberIn(@PathVariable("username") String username,
                                                                    @RequestParam("q") String query) {
        return this.organizationRepository.searchOrganizationsForUser(username, query);
    }

    @GetMapping(value = "/{organization}/projects")
    public List<Project> findAllProjects(@PathVariable("organization") String organizationName) {
        return projectRepository.findAllByOrganizationName(organizationName);
    }

    @GetMapping(value = "/{organization}/projects/search")
    public List<Project> searchOrganizationProjects(@PathVariable("organization") String organizationName,
                                                    @RequestParam("q") String query) {
        return projectRepository.searchAllForOrganization(organizationName, query);
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
        return memberApplicationRepository.findAllActive(organization);
    }

    @GetMapping(value = "/{organization}/project-applications")
    public List<ProjectApplication> findAllProjectApplications(@PathVariable("organization") String organization) {
        return this.projectApplicationRepository.findAllActive(organization);
    }

    @GetMapping(value = "/{organization}/project-applications/{username}")
    public List<ProjectApplication> findAllProjectApplicationsForUser(@PathVariable("organization") String organization,
                                                                      @PathVariable("username") String username) {
        return this.projectApplicationRepository.findAllActiveForUserOrg(organization, username);
    }

    @DeleteMapping(value = "/{organization}/delete-project-application/{applicationId}")
    public ResponseEntity<String> deleteProjectRequest(@PathVariable("organization") String organization,
                                                       @PathVariable("applicationId") Long applicationId) {
        Optional<ProjectApplication> projectApplication = projectApplicationRepository.findById(applicationId);
        if (projectApplication.isPresent()) {
            this.projectApplicationRepository.delete(projectApplication.get());
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("foobar", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/{organization}/overview/{projectId}")
    public Project getOrgProjectDetails(@PathVariable("organization") String organization,
                                        @PathVariable("projectId") Long projectId) {
        // TODO - should we check some permissions?
        Optional<Project> project = projectRepository.findById(projectId);
        return project.orElse(null);
    }

}
