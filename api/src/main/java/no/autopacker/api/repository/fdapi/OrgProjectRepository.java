package no.autopacker.api.repository.fdapi;

import no.autopacker.api.entity.fdapi.OrgProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrgProjectRepository extends JpaRepository<OrgProject, Long>{

    OrgProject findByOrganizationNameAndName(String organization, String projectName);

    List<OrgProject> findByOrganizationNameAndUser(String organization, String user);

    OrgProject findByOrganizationNameAndId(String organization, Long id);
}
