package no.autopacker.api.controller;

import no.autopacker.api.entity.Server;
import no.autopacker.api.entity.User;
import no.autopacker.api.repository.ServerRepository;
import no.autopacker.api.service.RemoteScriptExec;
import no.autopacker.api.service.ServerService;
import no.autopacker.api.userinterface.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controls all REST endpoints
 */
@RestController
@RequestMapping(value = "api/server")
public class ServerController {

    private final ServerService serverService;
    private final RemoteScriptExec remoteScriptExec;
    private final ServerRepository serverRepository;
    private final UserService userService;

    @Autowired
    public ServerController(ServerService serverService, ServerRepository serverRepository,
                            RemoteScriptExec remoteScriptExec, UserService userService) {
        this.serverService = serverService;
        this.serverRepository = serverRepository;
        this.remoteScriptExec = remoteScriptExec;
        this.userService = userService;
    }

    @PostMapping(value = "/deployProject")
    public ResponseEntity<String> deployProjectToServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body == null) {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
        JSONObject jsonObject = new JSONObject(body);

        Server server = this.serverRepository.findByServerId(jsonObject.getLong("serverId"));
        if (server == null) {
            return new ResponseEntity<>("Server not found", HttpStatus.NOT_FOUND);
        }
        User authUser = userService.getAuthenticatedUser();

        if (authUser != null && server.getOwner().equals(authUser.getUsername())) {
            if (this.remoteScriptExec.startDockerCompose(server,
                    authUser.getUsername(),
                    jsonObject.getString("projectName"),
                    jsonObject.getString("password")
            )) {
                // TODO Return IP and PORT (maybe) back to web application to give user info where he/she can view the deployed project
                // Returning OK for now
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

    }

    /**
     * Creates a new server from the specification declared in the httpEntity body
     *
     * @param httpEntity represents an HTTP request entity, consisting of headers and body
     * @return OK if creation succeeds and BAD_REQUEST if not
     */
    @PostMapping(value = "/new-server")
    public ResponseEntity<String> addNewServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body == null) {
            return new ResponseEntity<>("Body can't be empty", HttpStatus.BAD_REQUEST);
        }
        JSONObject jsonObject = new JSONObject(body);

        User authUser = userService.getAuthenticatedUser();
        String user_username = authUser.getUsername();

        Server serverExists = serverRepository
                .findByTitleAndOwnerIgnoreCase(jsonObject.getString("title"), user_username);
        if (serverExists != null) {
            return new ResponseEntity<>("Server already exists", HttpStatus.CONFLICT);
        }
        Server server = new Server(
                jsonObject.getString("title"),
                jsonObject.getString("ip"),
                jsonObject.getString("username"),
                user_username
        );
        if (jsonObject.has("ssh")) {
            server.setSsh(jsonObject.getString("ssh"));
        }
        if (jsonObject.has("desc")) {
            server.setDescription(jsonObject.getString("desc"));
        }
        this.serverRepository.save(server);
        return new ResponseEntity<>("Server successfully added", HttpStatus.OK);
    }

    @PostMapping(value = "/init")
    public ResponseEntity<String> initializeServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body == null) {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }

        JSONObject jsonObject = new JSONObject(body);
        Server server = this.serverRepository.findByServerId(jsonObject.getLong("serverId"));
        if (server == null) {
            return new ResponseEntity<>("Server not found", HttpStatus.NOT_FOUND);
        }

        User authUser = userService.getAuthenticatedUser();
        if (authUser != null && authUser.getUsername().equals(server.getOwner())) {
            this.remoteScriptExec.serverInit(server, jsonObject.getString("password"));
            return ResponseEntity.ok().build();
        } else {
            return new ResponseEntity<>("Not Authorized", HttpStatus.UNAUTHORIZED);
        }
    }

    @DeleteMapping(value = "/delete/{username}/{server}")
    public ResponseEntity<String> deleteServer(@PathVariable("username") String username,
        @PathVariable("server") Long serverId) {
        Server server = this.serverRepository.findByServerId(Long.valueOf(serverId));
        if (server != null) {
            User authUser = userService.getAuthenticatedUser();
            if (authUser != null && authUser.getUsername().equals(username)) {
                this.serverRepository.deleteById(Long.valueOf(serverId));
                return ResponseEntity.ok().build();
            } else {
                return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Server not found", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Returns the server found by its id. OK if the specified server is found and BAD_REQUEST if
     * not
     *
     * @param serverId The servers' id
     * @return the server found by its id. OK if the specified server is found and BAD_REQUEST if
     * not
     */
    @GetMapping(value = "/server-overview/{serverId}")
    public ResponseEntity<String> getServerOverview(@PathVariable("serverId") Long serverId) {
        return this.serverService.findServerById(serverId);
    }

    /**
     * Returns a list containing all the servers related to the authenticated user found by security
     * context
     *
     * @return a list containing all the servers related to the authenticated user found by security
     * context
     */
    @GetMapping
    public ResponseEntity<String> getAllServers() {
        return this.serverService.getAllServers();
    }

    /**
     * Returns a list containing all the servers related to the authenticated user that match the
     * search criteria for the servers title
     *
     * @param search search criteria for the servers
     * @return a list containing all the servers related to the authenticated user that match the
     * search criteria for the servers title
     */
    @GetMapping(value = "/{search}")
    public ResponseEntity<String> searchAllServers(@PathVariable("search") String search) {
        return this.serverService.searchAllServers(search);
    }

    /**
     * Returns status OK if a project/list of projects are successfully added to a server maintained
     * by the authenticated user. Returns status BAD_REQUEST if something goes wrong during
     * procedure
     *
     * @param httpEntity represents an HTTP request entity, consisting of headers and body
     * @return status OK if a project/list of projects are successfully added to a server maintained
     * * by the authenticated user. Returns status BAD_REQUEST if something goes wrong during
     * procedure
     */
    @PostMapping(value = "/add-project")
    public ResponseEntity<String> addProjectToServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.serverService.addProjectToServer(
                jsonObject.getLong("server_id"),
                jsonObject.getString("project_ids")
            );
        } else {
            return new ResponseEntity<>("Body can't be empty", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Return status ok if the specified project has been successfully removed from the specified
     * server and return status BAD_REQUEST if not
     *
     * @param httpEntity represents an HTTP request entity, consisting of headers and body
     * @return status ok if the specified project has been successfully removed from the specified
     * server and return status BAD_REQUEST if not
     */
    @PostMapping(value = "/remove-project")
    public ResponseEntity<String> removeProjectFromServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            return this.serverService.removeProjectFromServer(
                jsonObject.getLong("server_id"),
                jsonObject.getLong("project_id"),
                jsonObject.getString("project_name"),
                jsonObject.getString("password")
            );
        } else {
            return new ResponseEntity<>("Body can't be empty", HttpStatus.BAD_REQUEST);
        }
    }

}
