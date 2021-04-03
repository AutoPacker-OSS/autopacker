package no.autopacker.api.repository.fdapi;

import no.autopacker.api.entity.User;
import no.autopacker.api.entity.fdapi.Project;
import no.autopacker.api.entity.organization.Organization;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends CrudRepository<Project, Long> {
    Project findByOwnerAndName(User owner, String name);

    List<Project> findAllByOwner(User owner);

    @Query(value = "SELECT * FROM project WHERE is_private = 0", nativeQuery = true)
    List<Project> findAllPublic();

    @Query(value = "SELECT * FROM project WHERE is_private = 0 AND LOWER(name) LIKE CONCAT('%', LOWER(?1), '%')",
            nativeQuery = true)
    List<Project> searchAllPublic(String search);

    Project findByOwnerAndId(User owner, Long id);

    @Query(value = "SELECT * FROM project WHERE owner_id = ?1 AND LOWER(name) LIKE CONCAT('%', LOWER(?2), '%')",
            nativeQuery = true)
    List<Project> searchAllForUser(String ownerId, String search);

    @Query(value = "SELECT * FROM project WHERE is_private = false AND owner_id = ?1", nativeQuery = true)
    List<Project> findAllPublicForUser(String ownerId);

    @Query(value = "SELECT * FROM project WHERE is_private = false AND owner_id = ?1 " +
            "AND LOWER(name) LIKE CONCAT('%', LOWER(?2), '%')",
            nativeQuery = true)
    List<Project> searchAllPublicForUser(String ownerId, String search);

    @Query(value = "SELECT p.* FROM project p INNER JOIN organization o ON p.organization_id = o.id WHERE o.name = ?1",
            nativeQuery = true)
    List<Project> findAllByOrganizationName(String organizationName);

    @Query(value = "SELECT p.* FROM project p INNER JOIN organization o ON p.organization_id = o.id " +
            "WHERE o.name = ?1 AND LOWER(p.name) LIKE CONCAT('%', ?2, '%')",
            nativeQuery = true)
    List<Project> searchAllForOrganization(String organizationName, String projectNameQuery);
}
