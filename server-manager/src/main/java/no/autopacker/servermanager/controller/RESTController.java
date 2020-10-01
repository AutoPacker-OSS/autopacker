package no.autopacker.servermanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.autopacker.servermanager.entity.Server;
import no.autopacker.servermanager.repository.ServerRepository;
import no.autopacker.servermanager.service.RemoteScriptExec;
import no.autopacker.servermanager.service.ServerService;
import org.json.JSONObject;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
public class RESTController {

    private final ServerService serverService;
    private final RemoteScriptExec remoteScriptExec;
    private ServerRepository serverRepository;
    private ObjectMapper objectMapper;

    @Autowired
    public RESTController(ServerService serverService, ServerRepository serverRepository,
        RemoteScriptExec remoteScriptExec) {
        this.serverService = serverService;
        this.serverRepository = serverRepository;
        this.remoteScriptExec = remoteScriptExec;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping(value = "/deployProject")
    public ResponseEntity<String> deployProjectToServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);

            KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                    .getContext().getAuthentication().getPrincipal();

            Server server = this.serverRepository.findByServerId(jsonObject.getLong("serverId"));
            if (server.getOwner().equals(authUser.getKeycloakSecurityContext().getToken().getPreferredUsername())) {
                if (this.remoteScriptExec.startDockerCompose(server,
                        authUser.getKeycloakSecurityContext().getToken().getPreferredUsername(),
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

        } else {
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
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
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);

            KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

            String user_username = authUser.getKeycloakSecurityContext().getToken().getPreferredUsername();

            Server serverExists = this.serverRepository
                .findByTitleAndOwnerIgnoreCase(jsonObject.getString("title"), user_username);

            if (serverExists == null) {
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
            } else {
                return new ResponseEntity<>("Server already exists", HttpStatus.CONFLICT);
            }

        } else {
            return new ResponseEntity<>("Body can't be empty", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/init")
    public ResponseEntity<String> initializeServer(HttpEntity<String> httpEntity) {
        String body = httpEntity.getBody();
        if (body != null) {
            JSONObject jsonObject = new JSONObject(body);
            Server server = this.serverRepository.findByServerId(jsonObject.getLong("serverId"));

            KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                    .getContext().getAuthentication().getPrincipal();

            if (authUser.getKeycloakSecurityContext().getToken().getPreferredUsername().equals(server.getOwner())) {
                this.remoteScriptExec.serverInit(server, jsonObject.getString("password"));
                return ResponseEntity.ok().build();
            } else {
                return new ResponseEntity<>("Not Authorized", HttpStatus.UNAUTHORIZED);
            }
        } else{
            return new ResponseEntity<>("Body can't be null", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(value = "/delete/{username}/{server}")
    public ResponseEntity<String> deleteServer(@PathVariable("username") String username,
        @PathVariable("server") Long serverId) {
        Server server = this.serverRepository.findByServerId(Long.valueOf(serverId));
        if (server != null) {
            KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

            if (authUser.getKeycloakSecurityContext().getToken().getPreferredUsername().equals(username)) {
                this.serverRepository.deleteById(Long.valueOf(serverId));
                return ResponseEntity.ok().build();
            } else {
                return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return ResponseEntity.badRequest().build();
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
