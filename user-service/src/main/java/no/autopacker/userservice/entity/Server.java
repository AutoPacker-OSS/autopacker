package no.autopacker.userservice.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a server entity holding all information needed to connect, provision and manage
 */
@Data
@Entity
@NoArgsConstructor
public class Server {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long serverId;

    @NotEmpty
    private String title;

    private String description;

    @NotEmpty
    private String ip;

    @NotEmpty
    private String serverUsername;

    private String ssh;

    @NotEmpty
    private String owner;

    private String projectIds;

    private String status;

    private boolean open;

    public Server(String title, String ip, String username, String owner) {
        this.title = title;
        this.ip = ip;
        this.serverUsername = username;
        this.owner = owner;
        this.projectIds = "";
        this.status = "on";
        this.open = false;
    }

    public void addProjectId(String projectIds) {
        String[] projectArr = projectIds.split(",");
        for (int i = 0; i < projectArr.length; i++) {
            if (this.projectIds.equals("")) {
                this.projectIds += projectArr[i];
            } else {
                this.projectIds += "," + projectArr[i];
            }
        }
    }

    public boolean removeProjectId(Long id) {
        boolean projectIdDeleted = false;
        String[] list = this.projectIds.split(",");
        String newProjectIds = "";
        for (int i = 0; i < list.length; i++) {
            if (!String.valueOf(id).equals(list[i])) {
                if (newProjectIds.equals("")) {
                    newProjectIds += list[i];
                } else {
                    newProjectIds += "," + list[i];
                }
            } else {
                projectIdDeleted = true;
            }
        }
        this.projectIds = newProjectIds;
        return projectIdDeleted;
    }

    public String getIp(){
        return this.ip;
    }

    public String getOwner(){
        return this.owner;
    }

    public String getSsh() {
        return ssh;
    }
}
