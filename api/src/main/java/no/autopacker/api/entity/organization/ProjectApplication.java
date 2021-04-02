package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.entity.fdapi.Project;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class ProjectApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String comment;

    @OneToOne(targetEntity = Project.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "project_id")
    private Project project;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Temporal(javax.persistence.TemporalType.DATE)
    private Date created;

    private boolean isAccepted;

    public ProjectApplication(Project project, Organization organization, String comment) {
        this.organization = organization;
        this.project = project;
        this.comment = comment;
        this.isAccepted = false;
    }

    @PrePersist
    protected void onCreate() {
        this.created = new Date();
    }

}
