package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class MemberApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String comment;

    @OneToOne(targetEntity = Member.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "member_id")
    private Member member;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Temporal(javax.persistence.TemporalType.DATE)
    private Date created;

    private boolean isAccepted;

    public MemberApplication(Member member, String comment) {
        this.organization = member.getOrganization();
        this.member = member;
        this.comment = comment;
        this.isAccepted = false;
    }

    @PrePersist
    protected void onCreate() {
        this.created = new Date();
    }
}
