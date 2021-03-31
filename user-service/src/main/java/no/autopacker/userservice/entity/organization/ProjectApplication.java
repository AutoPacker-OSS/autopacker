package no.autopacker.userservice.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @OneToOne(targetEntity = Member.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "member_id")
    private Member member;

    @OneToOne(targetEntity = OrganizationProject.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "organization_project_id")
    private OrganizationProject organizationProject;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Temporal(javax.persistence.TemporalType.DATE)
    private Date created;

    private boolean isAccepted;

    public ProjectApplication(Member member, OrganizationProject organizationProject, String comment) {
        this.organization = member.getOrganization();
        this.member = member;
        this.organizationProject = organizationProject;
        this.comment = comment;
        this.isAccepted = false;
    }

    @PrePersist
    protected void onCreate() {
        this.created = new Date();
    }

}
