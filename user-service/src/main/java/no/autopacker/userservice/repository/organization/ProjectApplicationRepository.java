package no.autopacker.userservice.repository.organization;

import no.autopacker.userservice.entity.organization.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {

    List<ProjectApplication> findAllByOrganization_NameAndIsAcceptedIsFalse(String name);

    List<ProjectApplication> findAllByOrganization_NameAndMember_UsernameAndIsAcceptedIsFalse(String organization, String username);

    ProjectApplication findByOrganization_NameAndOrganizationProject_IdAndIsAcceptedIsFalse(String organization, Long projectId);
}
