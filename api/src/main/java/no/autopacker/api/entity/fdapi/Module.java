package no.autopacker.api.entity.fdapi;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Module {
    // Module Meta
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NotNull
    private String name;
    private String description;
    private String image;
    private int port;
    private String framework;
    private String language;
    // This needs to be string as it can hold char as values
    private String version;

    // Administrative Meta
    private String configType;
    private String location;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public Module(String name, int port, String language, String version, String configType, String location, Project project) {
        this.name = name;
        this.port = port;
        this.language = language;
        this.version = version;
        this.configType = configType;
        this.location = location;
        this.project = project;
    }
}
