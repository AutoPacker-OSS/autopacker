package no.autopacker.api.repository.organization;

import java.util.List;

import no.autopacker.api.entity.organization.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Organization findByName(String name);

    List<Organization> findAllByNameContaining(String search);

    @Query(value = "SELECT o.* FROM organization o " +
            "INNER JOIN org_member m ON m.organization_id = o.id " +
            "INNER JOIN user u ON u.id = m.user_id " +
            "WHERE u.username = ?1 AND LOWER(o.name) LIKE CONCAT('%', ?2, '%')",
            nativeQuery = true)
    List<Organization> searchOrganizationsForUser(String username, String query);

    @Query(value = "SELECT o.* FROM organization o " +
            "INNER JOIN org_member om on o.id = om.organization_id " +
            "WHERE om.user_id = ?1",
            nativeQuery = true)
    List<Organization> findAllByUser(String userId);
}
