package no.autopacker.general.repository.organization;

import no.autopacker.general.entity.organization.OrganizationProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<OrganizationProject, Long> {

        List<OrganizationProject> findAllByOrganization_NameAndIsAcceptedIsTrue(String name);

        OrganizationProject findByOrganization_NameAndName(String organization, String projectName);

        OrganizationProject findByOrganization_NameAndId(String organization, Long id);

        OrganizationProject findByOrganizationAndId(String organization, Long id);

        List<OrganizationProject> findAllByOrganization_NameAndAndNameContainingIgnoreCaseAndIsAcceptedIsTrue(String organization, String search);

}
