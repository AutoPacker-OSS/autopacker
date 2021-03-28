package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.OrgProjectMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrgProjectRepository {


    List<OrgProjectMeta> findAllByOrganization_NameAndIsAcceptedIsTrue(String name);

    OrgProjectMeta findByOrganization_NameAndName(String organization, String projectName);

    OrgProjectMeta findByOrganization_NameAndId(String organization, Long id);

    List<OrgProjectMeta> findAllByOrganization_NameAndAndNameContainingIgnoreCaseAndIsAcceptedIsTrue(String organization, String search);

}
