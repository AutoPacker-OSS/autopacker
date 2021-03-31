package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty
    private String username; // Used to identify AutoPacker user

    @NotEmpty
    private String name;

    @NotEmpty
    private String email;

    private String image;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @OneToMany(mappedBy = "member")
    private List<OrganizationProject> organizationProjects;

    @OneToOne(targetEntity = Role.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "role_id")
    private Role role;

    private boolean isEnabled;

    public Member(Organization organization, Role role, String username, String name, String email) {
        this.organization = organization;
        this.role = role;
        this.username = username;
        this.name = name;
        this.email = email;
        this.organizationProjects = new ArrayList<>();
        this.isEnabled = false;
    }
}
