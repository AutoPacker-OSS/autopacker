package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.api.entity.User;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class MemberApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String comment;

    // The requested role
    @NotNull
    private String role;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Temporal(javax.persistence.TemporalType.DATE)
    private Date created;

    private boolean isAccepted;

    public MemberApplication(User user, Organization organization, String role, String comment) {
        this.organization = organization;
        this.user = user;
        this.comment = comment;
        this.role = role;
        this.isAccepted = false;
    }

    @PrePersist
    protected void onCreate() {
        this.created = new Date();
    }
}
