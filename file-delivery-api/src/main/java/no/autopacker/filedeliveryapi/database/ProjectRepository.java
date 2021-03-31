package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.ProjectMeta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends CrudRepository<ProjectMeta, Long> {
    ProjectMeta findByOwnerAndName(String owner, String name);

    List<ProjectMeta> findAllByOwner(String owner);

    @Query(value = "SELECT * FROM projects WHERE is_private = 0", nativeQuery = true)
    List<ProjectMeta> findAllPublic();

    @Query(value = "SELECT * FROM projects WHERE is_private = 0 AND LOWER(name) LIKE CONCAT('%', LOWER(?1), '%')",
            nativeQuery = true)
    List<ProjectMeta> searchAllPublic(String search);

    ProjectMeta findByOwnerAndId(String owner, Long id);

    @Query(value = "SELECT * FROM projects WHERE owner = ?1 AND LOWER(name) LIKE CONCAT('%', LOWER(?2), '%')",
            nativeQuery = true)
    List<ProjectMeta> searchAllForUser(String owner, String search);

    @Query(value = "SELECT * FROM projects WHERE is_private = false AND owner = ?1", nativeQuery = true)
    List<ProjectMeta> findAllPublicForUser(String owner);

    @Query(value = "SELECT * FROM projects WHERE is_private = false AND owner = ?1 AND LOWER(name) LIKE CONCAT('%', LOWER(?2), '%')",
            nativeQuery = true)
    List<ProjectMeta> searchAllPublicForUser(String owner, String search);

}
