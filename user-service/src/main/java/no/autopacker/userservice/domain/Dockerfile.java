package no.autopacker.userservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "dockerfiles")
public class Dockerfile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NotNull
    private String name;
    private String location;

    public Dockerfile(String name, String location) {
        this.name = name;
        this.location = location;
    }
}
