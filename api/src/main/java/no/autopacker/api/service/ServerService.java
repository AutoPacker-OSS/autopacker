package no.autopacker.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import no.autopacker.api.entity.Server;
import no.autopacker.api.repository.ServerRepository;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Contains the main logic for handling server related features
 */
@Service
public class ServerService {

    private ServerRepository serverRepository;
    private RemoteScriptExec remoteScriptExec;
    private ObjectMapper objectMapper;

    @Autowired
    public ServerService(ServerRepository serverRepository, RemoteScriptExec remoteScriptExec,
                         ObjectMapper objectMapper) {
        this.serverRepository = serverRepository;
        this.remoteScriptExec = remoteScriptExec;
        this.objectMapper = objectMapper;
    }

    /**
     * Returns OK if a list of one or more projects are successfully attached to the specified
     * server and BAD_REQUEST if not
     *
     * @param server_id   The servers' id
     * @param project_ids String containing a list of one or more projects separated by comma
     * @return OK if a list of one or more projects are successfully attached to the specified
     * server and BAD_REQUEST if not
     */
    public ResponseEntity<String> addProjectToServer(Long server_id, String project_ids) {
        Server server = this.serverRepository.findByServerId(server_id);
        if (server != null) {
            server.addProjectId(project_ids);
            this.serverRepository.save(server);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Server doesn't exist", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Return status ok if the specified project has been successfully removed from the specified
     * server and return status BAD_REQUEST if not
     *
     * @param server_id  The servers' id
     * @param project_id The projects' id
     * @return Return status ok if the specified project has been successfully removed from the
     * specified server and return status BAD_REQUEST if not
     */
    public ResponseEntity<String> removeProjectFromServer(Long server_id, Long project_id, String projectName, String serverPassword) {
        Server server = this.serverRepository.findByServerId(server_id);
        if (server != null) {
            if (server.removeProjectId(project_id)) {
                if (this.remoteScriptExec.stopDockerCompose(server, server.getOwner(), projectName, serverPassword)) {
                    this.serverRepository.save(server);
                    return new ResponseEntity<>("OK", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Couldn't stop docker container",
                        HttpStatus.BAD_REQUEST);
                }
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return new ResponseEntity<>("Server doesn't exist", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Returns a list containing all the servers related to the authenticated user found by security
     * context
     *
     * @return a list containing all the servers related to the authenticated user found by security
     * context
     */
    public ResponseEntity<String> getAllServers() {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (authUser != null) {
            List<Server> servers = this.serverRepository
                .findAllByOwner(authUser.getKeycloakSecurityContext().getToken().getPreferredUsername());
            try {
                return new ResponseEntity<>(this.objectMapper.writeValueAsString(servers),
                    HttpStatus.OK);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Something went wrong while parsing servers",
                    HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Couldn't get the authenticated user", HttpStatus.OK);
        }
    }

    /**
     * Returns a list containing all the servers related to the authenticated user that match the
     * search criteria for the servers title
     *
     * @param search search criteria for the servers
     * @return Returns a list containing all the servers related to the authenticated user that
     * match the search criteria for the servers title
     */
    public ResponseEntity<String> searchAllServers(String search) {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();

        if (authUser != null) {
            List<Server> servers = this.serverRepository.findAllByTitleContainingAndAndOwner(search,
                authUser.getKeycloakSecurityContext().getToken().getPreferredUsername());
            try {
                return new ResponseEntity<>(this.objectMapper.writeValueAsString(servers),
                    HttpStatus.OK);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Something went wrong while parsing servers",
                    HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Couldn't get the authenticated user", HttpStatus.OK);
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
    public ResponseEntity<String> findServerById(Long serverId) {
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> authUser = (KeycloakPrincipal<RefreshableKeycloakSecurityContext>) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();

        if (authUser != null) {
            Server server = this.serverRepository.findByServerId(serverId);
            if (server.getOwner().equals(authUser.getKeycloakSecurityContext().getToken().getPreferredUsername())) {
                if (server != null) {
                    try {
                        return new ResponseEntity<>(this.objectMapper.writeValueAsString(server),
                            HttpStatus.OK);
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                        return new ResponseEntity<>("Something went wrong while parsing server",
                            HttpStatus.BAD_REQUEST);
                    }
                } else {
                    return new ResponseEntity<>("Server not found", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Can't access another this server",
                    HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User not authenticated", HttpStatus.BAD_REQUEST);
        }
    }

}
