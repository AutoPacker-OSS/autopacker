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
@Entity(name = "modules")
public class ModuleMeta {
    // Module Meta
    @Id
    private long id;
    @NotNull
    private String name;
    private String desc;
    private String image;
    private int port;
    private String framework;
    private String language;
    // This needs to be string as it can hold char as values
    private String version;

    // Administrative Meta
    private String configType;
    @Column(unique = true)
    private String location;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "project_id")
    private ProjectMeta project;

    public ModuleMeta(String name, int port, String language, String version, String configType, String location) {
        this.name = name;
        this.port = port;
        this.language = language;
        this.version = version;
        this.configType = configType;
        this.location = location;
    }
}
