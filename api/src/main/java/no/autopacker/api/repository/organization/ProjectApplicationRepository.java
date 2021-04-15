package no.autopacker.api.repository.organization;

import no.autopacker.api.entity.organization.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    @Query(value = "SELECT a.* FROM project_application a INNER JOIN organization o ON a.organization_id = o.id " +
            "WHERE o.name = ?1 AND is_accepted = false",
            nativeQuery = true)
    List<ProjectApplication> findAllActive(String organizationName);

    @Query(value = "SELECT pa.* FROM project_application pa " +
            "INNER JOIN project p ON pa.project_id = p.id " +
            "INNER JOIN user u ON p.owner_id = u.id " +
            "INNER JOIN org_member om ON u.id = om.user_id " +
            "INNER JOIN organization o ON om.organization_id = o.id " +
            "WHERE o.name = ?1 AND u.username = ?2 AND is_accepted = false AND pa.organization_id = o.id",
            nativeQuery = true)
    List<ProjectApplication> findAllActiveForUserOrg(String organization, String username);

    @Query(value = "SELECT a.* FROM project_application a INNER JOIN organization o ON a.organization_id = o.id " +
            "WHERE o.name = ?1 AND a.project_id = ?2 AND is_accepted = false",
            nativeQuery = true)
    ProjectApplication findForProjAndOrg(String organization, Long projectId);
}
