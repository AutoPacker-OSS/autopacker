package no.autopacker.userservice.repository.organization;


import no.autopacker.userservice.entity.organization.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findAllByOrganization_NameAndIsEnabledIsTrue(String name);

    Member findByUsernameIgnoreCaseAndIsEnabledIsTrue(String username);

    Member findByOrganization_NameAndUsername(String organization, String username);

}
