package no.autopacker.general.repository.organization;

import no.autopacker.general.entity.organization.Member;
import no.autopacker.general.entity.organization.MemberApplication;
import no.autopacker.general.entity.tools.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberApplicationRepository extends JpaRepository<MemberApplication, Long> {

    List<MemberApplication> findAllByOrganization_NameAndIsAcceptedIsFalse(String name);

    MemberApplication findByMember_Username(String username);

    void deleteByMember_Username(String username);

}
