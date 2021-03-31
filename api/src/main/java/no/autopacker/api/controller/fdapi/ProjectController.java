package no.autopacker.api.controller.fdapi;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.autopacker.api.entity.fdapi.ModuleMeta;
import no.autopacker.api.entity.fdapi.ProjectMeta;
import no.autopacker.api.repository.fdapi.ModuleRepository;
import no.autopacker.api.repository.fdapi.MongoDb;
import no.autopacker.api.repository.fdapi.ProjectRepository;
import no.autopacker.api.service.fdapi.BuilderService;
import no.autopacker.api.utils.fdapi.Utils;
import org.apache.commons.io.FileUtils;
import org.bson.Document;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CrossOrigin(origins = "*")
@RestController
public class ProjectController {
    private final ProjectRepository projectRepo;
    private final ModuleRepository moduleRepo;
    private final BuilderService builderService;
    private final MongoDb mongoDb;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public ProjectController(ProjectRepository projectRepo, ModuleRepository moduleRepo, BuilderService builderService, MongoDb mongoDb) {
        this.projectRepo = projectRepo;
        this.moduleRepo = moduleRepo;
        this.builderService = builderService;
        this.mongoDb = mongoDb;
    }

    /**
     * Get project meta data if you're the owner or admin or the project is not private.
     *
     * @param username    project owner
     * @param projectName project name
     * @return meta data of project
     */
    @RequestMapping(value = "/projects/{username}/{project-name}", method = RequestMethod.GET)
    public ResponseEntity getUserProjectDetails(@PathVariable("username") String username,
                                                @PathVariable("project-name") String projectName) {
        ResponseEntity response = null;

        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        ProjectMeta pm = projectRepo.findByOwnerAndProjectName(username, projectName);

        if (pm != null) {
            pm.setModules(moduleRepo.findAllByProjectId(pm.getId()));
            if (pm.isPrivate()) {
                if (authenticatedUser != null) {
                    if (authenticatedUser.getKeycloakSecurityContext().getToken().getPreferredUsername().equalsIgnoreCase(username) || authenticatedUser.getKeycloakSecurityContext().getToken().getResourceAccess("file-delivery-api").isUserInRole("ADMIN")) {
                        response = ResponseEntity.ok(pm);
                    } else {
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("You don't have permissions to view this project.");
                    }
                } else {
                    response = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("You must be logged in and have permissions to see info about this project");
                }
            } else {
                response = ResponseEntity.ok(pm);
            }
        } else {
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist.");
        }

        return response;
    }

    @RequestMapping(value = "/projects/{username}/search")
    public ResponseEntity<String> searchUserProject(@PathVariable("username") String username,
                                                    @RequestParam("q") String query) {
        try {
            if (query.trim().equals("")) {
                List<ProjectMeta> userProjects = projectRepo.findAllByOwner(username);

                return ResponseEntity.ok(this.objectMapper.writeValueAsString(userProjects));

            } else {
                List<ProjectMeta> userProjects = projectRepo.searchAllForUser(username, query);
                return ResponseEntity.ok(this.objectMapper.writeValueAsString(userProjects));
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Something went wrong while parsing projects", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Create a project under your username. Admins can create projects how they want.
     *
     * @param jsonString A json string containing username, project name and project visibility, see ProjectMeta
     * @return Status forbidden if project created under another username, status bad request if json is
     * malformed, status ok if the project was created or status unauthorized if user is not
     * logged in.
     * @see ProjectMeta
     */
    @RequestMapping(value = "/projects", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity createProject(@RequestBody String jsonString) {
        ResponseEntity response;

        try {
            JSONObject json = new JSONObject(jsonString);

            KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                    .getContext().getAuthentication().getPrincipal();

            if (authUser != null) {
                ProjectMeta pm = new ProjectMeta(json);
                pm.setOwner(authUser.getKeycloakSecurityContext().getToken().getPreferredUsername());

                // Checks if the project has a valid name
                Pattern pattern = Pattern.compile("[\\w-]*");
                Matcher matcher = pattern.matcher(pm.getProjectName());

                if (matcher.matches()) {
                    // Check if userspace exists or create one, then assign a file directory (that hasn't been created yet)
                    Utils.instance().validateUserWorkspace(pm.getOwner());
                    String projectPath = Utils.instance().getUserProjectDir(pm.getOwner(), pm.getProjectName());
                    File projectFolder = new File(projectPath);

                    if (projectFolder.exists() ||
                            projectRepo.findByOwnerAndProjectName(pm.getOwner(), pm.getProjectName()) != null) {
                        response = ResponseEntity.status(HttpStatus.CONFLICT).body("Project already exists.");
                    } else {
                        if (projectFolder.mkdir()) {
                            // File directory has been created
                            pm.setLocation(projectPath);
                            projectRepo.save(pm);
                            response = ResponseEntity.ok().build();
                        } else {
                            response = ResponseEntity.badRequest().body("Something went wrong...");
                        }
                    }
                } else {
                    response = ResponseEntity.badRequest()
                            .body("The project name can only contain alphanumeric values combined with dash and underscore");
                }

            } else {
                response = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You need to be logged in.");
            }

        } catch (JSONException e) {
            e.printStackTrace();
            response = ResponseEntity.badRequest().body(e.getMessage());
        }

        return response;
    }

    /**
     * Find the project file and deletes the project. You must be the owner or admin to delete the project.
     *
     * @param username    username of the project owner
     * @param projectName name of the project
     * @return status OK if the has been deleted, status NOT FOUND if the project is not found
     * status internal error if project could't be deleted, status forbidden if the requester
     * is not admin or project owner or status unauthorized if user is not logged in.
     */
    @RequestMapping(value = "/projects/{username}/{project}", method = RequestMethod.DELETE)
    public ResponseEntity deleteUserProject(@PathVariable("username") String username,
                                            @PathVariable("project") String projectName) {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        ResponseEntity response;

        if (authenticatedUser != null) {
            if (authenticatedUser.getKeycloakSecurityContext().getToken().getPreferredUsername().equals(username) ||
                    authenticatedUser.getKeycloakSecurityContext().getToken().getResourceAccess("file-delivery-api").isUserInRole("ADMIN")) {
                ProjectMeta pm = projectRepo.findByOwnerAndProjectName(username, projectName);

                if (pm != null) {
                    pm.setModules(moduleRepo.findAllByProjectId(pm.getId()));

                    // This is a switch in case something goes wrong when deleting module(s)
                    boolean moduleDeletionFailed = false;

                    if (pm.hasModules()) {
                        // All contents of directory must be deleted before deleting the folder
                        // TODO rename variables here
                        for (ModuleMeta mm : pm.getModules()) {
                            File moduleDirectory = new File(mm.getLocation());
                            if (moduleDirectory.exists()) {
                                try {
                                    FileUtils.cleanDirectory(moduleDirectory);
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                                // Delete directory
                                if (!moduleDirectory.delete()) {
                                    moduleDeletionFailed = true;
                                } else {
                                    moduleRepo.deleteById(mm.getId());
                                    mongoDb.deleteByModuleId(mm.getId());
                                }
                            }
                        }
                    }

                    // Start deleting project when all modules are gone
                    if (!moduleDeletionFailed) {
                        File projectDir = new File(pm.getLocation());
                        try {
                            FileUtils.cleanDirectory(projectDir);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                        if (!projectDir.exists() || projectDir.delete()) {
                            projectRepo.delete(pm);
                            response = ResponseEntity.ok("Project '" + projectName + "' deleted.");
                        } else {
                            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Couldn't delete project");
                        }
                    } else {
                        response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Couldn't delete project");
                    }

                } else {
                    response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist");
                }
            } else {
                response = ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only delete project under your own name.");
            }
        } else {
            response = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You need to be logged in.");
        }

        return response;
    }

    /**
     * Return all projects owned by a user.
     *
     * @param username user to list projects of
     * @return a list of project meta data of projects
     */
    @RequestMapping(value = "/projects/{username}", method = RequestMethod.GET)
    public ResponseEntity getAllProjectsFromUser(@PathVariable("username") String username) {
        List userProjects = projectRepo.findAllByOwner(username);
        return ResponseEntity.ok(userProjects);
    }

    @RequestMapping(value = "/projects/{username}/public", method = RequestMethod.GET)
    public ResponseEntity<String> getAllPublicProjectsForUser(@PathVariable("username") String username) {
        List<ProjectMeta> list = this.projectRepo.findAllPublicForUser(username);
        try {
            return ResponseEntity.ok(this.objectMapper.writeValueAsString(list));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @RequestMapping(value = "/projects/{username}/public/search", method = RequestMethod.GET)
    public ResponseEntity<String> searchAllPublicProjectsForUser(@PathVariable("username") String username,
                                                                 @RequestParam("q") String query) {
        List<ProjectMeta> list = this.projectRepo.searchAllPublicForUser(username, query);
        try {
            return ResponseEntity.ok(this.objectMapper.writeValueAsString(list));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // TODO - should this be authorized only to user who owns the project?
    @GetMapping(value = "/project-overview/{projectId}")
    public ResponseEntity<String> getProjectOverview(@PathVariable("projectId") Long projectId) {
        ResponseEntity response;
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        if (authenticatedUser != null) {
            Optional<ProjectMeta> op = this.projectRepo.findById(projectId);
            if (op.isPresent()) {
                try {
                    return ResponseEntity.ok(this.objectMapper.writeValueAsString(op.get()));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong while parsing projects");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong while parsing projects");
            }
        } else {
            response = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You must be logged in to perform this action");
        }
        return response;
    }

    @GetMapping(value = "/project-overview/{username}/{projectId}")
    public ResponseEntity<String> getServerOverview(@PathVariable("username") String username,
                                                    @PathVariable("projectId") Long projectId) {
        ResponseEntity<String> response;
        ProjectMeta projectMeta = this.projectRepo.findByOwnerAndId(username, projectId);
        if (projectMeta != null) {
            projectMeta.setModules(this.moduleRepo.findAllByProjectId(projectId));
            try {
                response = new ResponseEntity(this.objectMapper.writeValueAsString(projectMeta), HttpStatus.OK);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                response = new ResponseEntity("Something went wrong while parsing project", HttpStatus.BAD_REQUEST);
            }
        } else {
            response = new ResponseEntity("Couldn't find project matching criteria", HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    public ResponseEntity<String> getAllServers() {
        ResponseEntity<String> response;
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        if (authUser != null) {
            String username = authUser.getKeycloakSecurityContext().getToken().getPreferredUsername();
            List<ProjectMeta> projects = this.projectRepo.findAllByOwner(username);
            try {
                return ResponseEntity.ok(this.objectMapper.writeValueAsString(projects));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong while parsing projects");
            }
        } else {
            response = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You must be logged in to perform this action");
        }
        return response;
    }

    @RequestMapping(value = "/projects/search", method = RequestMethod.GET)
    public ResponseEntity<String> searchPublicProjects(@RequestParam("q") String query) {
        ResponseEntity<String> responseEntity;
        List<ProjectMeta> projectMetas;
        try {
            if (query.trim().equals("")) {
                projectMetas = this.projectRepo.findAllPublic();
            } else {
                projectMetas = this.projectRepo.searchAllPublic(query);
            }
            responseEntity = new ResponseEntity<>(this.objectMapper.writeValueAsString(projectMetas), HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            responseEntity = new ResponseEntity<>("Something went wrong while parsing projects", HttpStatus.BAD_REQUEST);
        }
        return responseEntity;
    }

    /**
     * TODO Should this be an option?
     * Get all projects available if you are admin.
     *
     * @return all projects
     */
    @RequestMapping(value = "/projects/all", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity getAllProjects() {
        ResponseEntity response;
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        if (authenticatedUser.getKeycloakSecurityContext().getToken().getResourceAccess("file-delivery-api").isUserInRole("ADMIN")) {
            response = ResponseEntity.ok(projectRepo.findAll());
        } else {
            response = ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permissions to view all projects");
        }

        return response;
    }

    @RequestMapping(value = "/projects/search/{search}", method = RequestMethod.GET)
    public ResponseEntity<String> searchAllProjects(@PathVariable("search") String search) {
        ResponseEntity response;
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authenticatedUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        if (authenticatedUser != null) {
            String username = authenticatedUser.getKeycloakSecurityContext().getToken().getPreferredUsername();
            List<ProjectMeta> projects = this.projectRepo.searchAllForUser(username, search);
            try {
                return ResponseEntity.ok(this.objectMapper.writeValueAsString(projects));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong while parsing projects");
            }
        } else {
            response = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You must be logged in to perform this action");
        }
        return response;
    }

    @RequestMapping(value = "/projects/{username}/{project-name}/docker-compose.yml",
            method = RequestMethod.GET, produces = "text/yaml")
    public ResponseEntity getProjectDockerCompose(@PathVariable("username") String username,
                                                  @PathVariable("project-name") String projectName) throws Exception {
        ResponseEntity response;
        ProjectMeta project = projectRepo.findByOwnerAndProjectName(username, projectName);

        if (project != null) {
            if (!project.isPrivate()) {
                project.setModules(moduleRepo.findAllByProjectId(project.getId()));

                if (project.getModules() != null && project.getModules().size() > 0) {
                    // Get the main docker-compose file that all the module services will be put in
                    String mainDockerComposeLocation = Utils.instance().getDockerComposeLocation("main");
                    String mainTemplate = FileUtils.readFileToString(new File(mainDockerComposeLocation), "utf-8");

                    StringBuilder serviceComposeBlockBuilder = new StringBuilder();

                    for (ModuleMeta module : project.getModules()) {
                        Document params = mongoDb.findByModuleId(module.getId());
                        serviceComposeBlockBuilder.append(builderService.compileModuleComposeBlock(module, params, username));
                    }

                    // New map that will replace the SERVICE placeholder with the services mashed together
                    JSONObject json = new JSONObject();
                    json.put("SERVICES", serviceComposeBlockBuilder.toString());

                    response = ResponseEntity.ok(builderService.buildFromTemplate(mainTemplate, json, false));
                } else {
                    response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not have any modules");
                }
            } else {
                // Using 404 instead of 403 for security reasons
                response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist");
            }
        } else {
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project does not exist");
        }

        return response;
    }
}
