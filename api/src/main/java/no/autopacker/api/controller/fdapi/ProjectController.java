package no.autopacker.api.controller.fdapi;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.autopacker.api.entity.Server;
import no.autopacker.api.entity.User;
import no.autopacker.api.entity.fdapi.Module;
import no.autopacker.api.entity.fdapi.Project;
import no.autopacker.api.interfaces.UserService;
import no.autopacker.api.repository.ServerRepository;
import no.autopacker.api.repository.UserRepository;
import no.autopacker.api.repository.fdapi.ModuleRepository;
import no.autopacker.api.repository.fdapi.MongoDb;
import no.autopacker.api.repository.fdapi.ProjectRepository;
import no.autopacker.api.service.fdapi.BuilderService;
import no.autopacker.api.utils.fdapi.Utils;
import org.apache.commons.io.FileUtils;
import org.bson.Document;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static no.autopacker.api.security.AuthConstants.ROLE_ADMIN;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "api")
public class ProjectController {
    private final ProjectRepository projectRepo;
    private final ModuleRepository moduleRepo;
    private final BuilderService builderService;
    private final MongoDb mongoDb;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserService userService;
    private final UserRepository userRepository;
    private final ServerRepository serverRepository;


    @Autowired
    public ProjectController(ProjectRepository projectRepo, ModuleRepository moduleRepo, BuilderService builderService,
                             MongoDb mongoDb, UserService userService, UserRepository userRepository, ServerRepository serverRepository) {
        this.projectRepo = projectRepo;
        this.moduleRepo = moduleRepo;
        this.builderService = builderService;
        this.mongoDb = mongoDb;
        this.userService = userService;
        this.userRepository = userRepository;
        this.serverRepository = serverRepository;

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

        User authenticatedUser = userService.getAuthenticatedUser();
        User owner = userRepository.findByUsername(username);
        Project pm = projectRepo.findByOwnerAndName(owner, projectName);

        if (pm != null) {
            pm.setModules(moduleRepo.findAllByProjectId(pm.getId()));
            if (pm.isPrivate()) {
                if (authenticatedUser != null) {
                    if (authenticatedUser.getUsername().equalsIgnoreCase(username)
                            || authenticatedUser.hasSystemRole(ROLE_ADMIN)) {
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
        User user = this.userRepository.findByUsername(username);
        if (user != null) {
            try {
                if (query.trim().equals("")) {
                    List<Project> userProjects = projectRepo.findAllByOwner(user);
                    userProjects.removeIf(Project::hasOrganization);
                    return ResponseEntity.ok(this.objectMapper.writeValueAsString(userProjects));

                } else {
                    List<Project> userProjects = projectRepo.searchAllForUser(user.getId(), query);
                    userProjects.removeIf(Project::hasOrganization);
                    return ResponseEntity.ok(this.objectMapper.writeValueAsString(userProjects));
                }
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Something went wrong while parsing projects", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Create a project with the authenticated user as the owner. Admins can create projects how they want.
     *
     * @param jsonString A json string containing username, project name and project visibility, see ProjectMeta
     * @return Status forbidden if project created under another username, status bad request if json is
     * malformed, status ok if the project was created or status unauthorized if user is not
     * logged in.
     * @see Project
     */
    @RequestMapping(value = "/projects", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity createProject(@RequestBody String jsonString) {
        ResponseEntity response;

        try {
            JSONObject json = new JSONObject(jsonString);
            User authUser = userService.getAuthenticatedUser();

            if (authUser != null) {
                Project pm = new Project(json);
                pm.setOwner(authUser);

                // Checks if the project has a valid name
                Pattern pattern = Pattern.compile("[\\w-]*");
                Matcher matcher = pattern.matcher(pm.getName());

                if (matcher.matches()) {
                    String username = authUser.getUsername();
                    // Check if userspace exists or create one, then assign a file directory (that hasn't been created yet)
                    Utils.instance().validateUserWorkspace(username);
                    String projectPath = Utils.instance().getUserProjectDir(username, pm.getName());
                    File projectFolder = new File(projectPath);
                    if (projectFolder.exists() ||
                            projectRepo.findByOwnerAndName(authUser, pm.getName()) != null) {
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
        User authenticatedUser = userService.getAuthenticatedUser();
        ResponseEntity response;
        User owner = userRepository.findByUsername(username);

        if (authenticatedUser != null) {
            if (authenticatedUser.getUsername().equalsIgnoreCase(username)
                    || authenticatedUser.hasSystemRole(ROLE_ADMIN)) {
                Project pm = projectRepo.findByOwnerAndName(owner, projectName);

                if (pm != null) {
                    pm.setModules(moduleRepo.findAllByProjectId(pm.getId()));

                    // This is a switch in case something goes wrong when deleting module(s)
                    boolean moduleDeletionFailed = false;

                    if (pm.hasModules()) {
                        // All contents of directory must be deleted before deleting the folder
                        // TODO rename variables here
                        for (Module mm : pm.getModules()) {
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
                            System.out.println("Directory " + pm.getLocation() + " not found, can't be cleaned");
                        } catch (IllegalArgumentException e) {
                            System.out.println("Directory " + pm.getLocation() + " not found, can't be cleaned");
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
        List<Project> userProjects = projectRepo.findAllByOwner(userRepository.findByUsername(username));
        return ResponseEntity.ok(userProjects);
    }

    @RequestMapping(value = "/projects/{username}/public", method = RequestMethod.GET)
    public ResponseEntity<String> getAllPublicProjectsForUser(@PathVariable("username") String username) {
        User user = this.userRepository.findByUsername(username);
        List<Project> list = this.projectRepo.findAllPublicForUser(user.getId());
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
        User user = this.userRepository.findByUsername(username);
        List<Project> list = this.projectRepo.searchAllPublicForUser(user.getId(), query);
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
        User authenticatedUser = userService.getAuthenticatedUser();
        if (authenticatedUser != null) {
            Optional<Project> op = this.projectRepo.findById(projectId);
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

    @GetMapping(value = "/project-overview/{username}/{projectName}")
    public ResponseEntity<String> getProjectOverview(@PathVariable("username") String username,
                                                     @PathVariable("projectName") String projectName) {
        User user = this.userRepository.findByUsername(username);
        Project project = this.projectRepo.findByOwnerAndName(user, projectName);
        if (project != null) {
            project.setModules(this.moduleRepo.findAllByProjectId(project.getId()));
            try {
                String responseString = this.objectMapper.writeValueAsString(project);
                return new ResponseEntity<>(responseString, HttpStatus.OK);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Something went wrong while parsing project", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Couldn't find project matching criteria", HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    public ResponseEntity<String> getAllUserProjects() {
        ResponseEntity<String> response;
        User authUser = userService.getAuthenticatedUser();
        if (authUser != null) {
            List<Project> projects = this.projectRepo.findAllByOwner(authUser);
            projects.removeIf(Project::hasOrganization);
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

    @RequestMapping(value = "/projectsForServer/{serverId}", method = RequestMethod.GET)
    public ResponseEntity<String> getAllProjectForServer(@PathVariable("serverId") Long serverId) {
        ResponseEntity<String> response;
        User authUser = userService.getAuthenticatedUser();
        if (authUser != null) {
            Server server = serverRepository.findByServerId(serverId);
            String projectIds = server.getProjectIds();
            Long ps = null;
            List<Project> projects = new ArrayList<>();
            for (String s : projectIds.split(",")) {
                ps = Long.parseLong(s);
                Project p = projectRepo.findProjectById(ps);
                if (p != null) {
                    projects.add(p);
                }
            }
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
        List<Project> projects;
        try {
            if (query.trim().equals("")) {
                projects = this.projectRepo.findAllPublic();
            } else {
                projects = this.projectRepo.searchAllPublic(query);
            }
            responseEntity = new ResponseEntity<>(this.objectMapper.writeValueAsString(projects), HttpStatus.OK);
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
        User authenticatedUser = userService.getAuthenticatedUser();

        if (authenticatedUser.hasSystemRole(ROLE_ADMIN)) {
            response = ResponseEntity.ok(projectRepo.findAll());
        } else {
            response = ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permissions to view all projects");
        }

        return response;
    }

    @RequestMapping(value = "/projects/search/{search}", method = RequestMethod.GET)
    public ResponseEntity<String> searchAllProjects(@PathVariable("search") String search) {
        ResponseEntity response;
        User authenticatedUser = userService.getAuthenticatedUser();
        if (authenticatedUser != null) {
            List<Project> projects = this.projectRepo.searchAllForUser(authenticatedUser.getUsername(), search);
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
        User owner = userRepository.findByUsername(username);
        Project project = projectRepo.findByOwnerAndName(owner, projectName);

        if (project != null) {
            if (!project.isPrivate()) {
                project.setModules(moduleRepo.findAllByProjectId(project.getId()));

                if (project.getModules() != null && project.getModules().size() > 0) {
                    // Get the main docker-compose file that all the module services will be put in
                    String mainDockerComposeLocation = Utils.instance().getDockerComposeLocation("main");
                    String mainTemplate = FileUtils.readFileToString(new File(mainDockerComposeLocation), "utf-8");

                    StringBuilder serviceComposeBlockBuilder = new StringBuilder();

                    for (Module module : project.getModules()) {
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
