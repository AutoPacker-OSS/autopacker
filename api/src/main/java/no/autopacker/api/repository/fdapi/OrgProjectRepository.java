package no.autopacker.api.repository.fdapi;

import no.autopacker.api.entity.fdapi.OrgProjectMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrgProjectRepository extends JpaRepository<OrgProjectMeta, Long>{

    OrgProjectMeta findByOrganizationNameAndName(String organization, String projectName);

    List<OrgProjectMeta> findByOrganizationNameAndUser(String organization, String user);

    OrgProjectMeta findByOrganizationNameAndId(String organization, Long id);
}
