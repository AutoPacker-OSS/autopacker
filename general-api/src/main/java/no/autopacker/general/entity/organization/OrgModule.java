package no.autopacker.general.entity.organization;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrgModule {
    private long id;
    private String name;
    private int port;
    private String language;
    private String version;
    private String configType;
    private String location;
    private long projectId;

    public OrgModule(String name, int port, String language, String version, String configType, String location, long projectId) {
        this.name = name;
        this.port = port;
        this.language = language;
        this.version = version;
        this.configType = configType;
        this.location = location;
        this.projectId = projectId;
    }

}
