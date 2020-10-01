package no.autopacker.general.repository.organization;

import no.autopacker.general.entity.organization.Member;
import no.autopacker.general.entity.tools.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findAllByOrganization_NameAndIsEnabledIsTrue(String name);

    Member findByUsernameIgnoreCaseAndIsEnabledIsTrue(String username);

    Member findByOrganization_NameAndUsername(String organization, String username);

}
