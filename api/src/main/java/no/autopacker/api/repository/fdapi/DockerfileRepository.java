package no.autopacker.api.repository.fdapi;

import no.autopacker.api.entity.fdapi.Dockerfile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DockerfileRepository extends CrudRepository<Dockerfile, Long> {
    Dockerfile findByNameIgnoreCase(String name);
}
