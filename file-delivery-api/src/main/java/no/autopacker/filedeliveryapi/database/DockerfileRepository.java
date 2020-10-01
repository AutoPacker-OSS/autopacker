package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.Dockerfile;

public interface DockerfileRepository {
    void save(Dockerfile dockerfile);
    void delete(Long id);
    Dockerfile findByName(String name);
}
