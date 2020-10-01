package no.autopacker.general.entity.tools;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.List;


@Data
@Entity
@NoArgsConstructor
public class Language {

    @Id
    @Column(name = "language_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public String getLanguage() {
        return language;
    }

    @NotEmpty
    private String language;


    @Column(name = "version_id")
    @OneToMany(targetEntity = Version.class, fetch = FetchType.EAGER, mappedBy = "languageID")
    private List<Version> version;

    public Language(String language) {
        this.language = language;
    }

    public void setVersion(List<Version> version){
        this.version = version;
    }

    public List<Version> getVersion(){
        return this.version;
    }
}
