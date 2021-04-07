package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.entity.User;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

@Data
@Entity
@Table(name = "org_member")
@NoArgsConstructor
public class Member {
    @EmbeddedId
    private OrgMemberKey id;

    @PrePersist
    private void prePersist() {
        if (getId() == null) {
            System.out.println("Here we go!");
            OrgMemberKey key = new OrgMemberKey();
            key.setUserId(user.getId());
            key.setOrganizationId(organization.getId());
        }
    }

    @NotEmpty
    @Column(name = "role")
    private String role = ""; // Role for this user in this organization

    @ManyToOne
    @MapsId("user_id")
    private User user;

    @ManyToOne
    @MapsId("organization_id")
    private Organization organization;

    public Member(Organization organization, User user, String role) {
        this.organization = organization;
        this.user = user;
        this.role = role;
        this.id = new OrgMemberKey(user.getId(), organization.getId());
    }

    @Override
    public String toString() {
        return "Org #" + organization.getId() + " member " + user.getUsername() + " [" + role + "]";
    }
}
