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

    @Query(value = "SELECT DISTINCT pa.* FROM project_application pa " +
            "INNER JOIN organization o ON pa.organization_id = o.id " +
            "INNER JOIN project p on o.id = p.organization_id " +
            "INNER JOIN user u ON p.owner_id = u.id " +
            "WHERE o.name = ?1 AND u.username = ?2 AND is_accepted = false",
            nativeQuery = true)
    List<ProjectApplication> findAllActiveForUserOrg(String organization, String username);

    @Query(value = "SELECT a.* FROM project_application a INNER JOIN organization o ON a.organization_id = o.id " +
            "WHERE o.name = ?1 AND a.project_id = ?2 AND is_accepted = false",
            nativeQuery = true)
    ProjectApplication findForProjAndOrg(String organization, Long projectId);
}
