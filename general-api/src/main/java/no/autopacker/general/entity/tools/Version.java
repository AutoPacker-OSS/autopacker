package no.autopacker.general.entity.tools;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.autopacker.general.entity.tools.Language;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@NoArgsConstructor
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @NotNull
    @ManyToOne(targetEntity = Language.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "version_id")
    private Language languageID;


    public int getVersion() {
        return version;
    }

    private int version;

    public Version(int version, Language language) {
        this.version = version;
        this.languageID = language;
    }
}
