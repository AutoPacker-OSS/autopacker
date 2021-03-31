package no.autopacker.api.repository.fdapi;

import no.autopacker.api.entity.fdapi.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends CrudRepository<Project, Long> {
    Project findByOwnerAndName(String owner, String name);

    List<Project> findAllByOwner(String owner);

    @Query(value = "SELECT * FROM project WHERE is_private = 0", nativeQuery = true)
    List<Project> findAllPublic();

    @Query(value = "SELECT * FROM project WHERE is_private = 0 AND LOWER(name) LIKE CONCAT('%', LOWER(?1), '%')",
            nativeQuery = true)
    List<Project> searchAllPublic(String search);

    Project findByOwnerAndId(String owner, Long id);

    @Query(value = "SELECT * FROM project WHERE owner = ?1 AND LOWER(name) LIKE CONCAT('%', LOWER(?2), '%')",
            nativeQuery = true)
    List<Project> searchAllForUser(String owner, String search);

    @Query(value = "SELECT * FROM project WHERE is_private = false AND owner = ?1", nativeQuery = true)
    List<Project> findAllPublicForUser(String owner);

    @Query(value = "SELECT * FROM project WHERE is_private = false AND owner = ?1 AND LOWER(name) LIKE CONCAT('%', LOWER(?2), '%')",
            nativeQuery = true)
    List<Project> searchAllPublicForUser(String owner, String search);

}
