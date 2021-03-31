package no.autopacker.userservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

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
    private String description;
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
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
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
