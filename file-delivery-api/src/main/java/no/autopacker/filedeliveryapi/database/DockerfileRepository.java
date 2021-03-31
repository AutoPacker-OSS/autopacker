package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.Dockerfile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DockerfileRepository extends CrudRepository<Dockerfile, Long> {
    Dockerfile findByNameIgnoreCase(String name);
}
