package no.autopacker.api.entity.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

@Data
@Entity
@NoArgsConstructor
public class Authority implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    @NotEmpty
    String authority;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="role_id")
    private Role role;

    public Authority(String authority, Role role) {
        this.authority = authority;
        this.role = role;
    }
}
