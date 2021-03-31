package no.autopacker.api.repository.organization;

import no.autopacker.api.entity.organization.MemberApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberApplicationRepository extends JpaRepository<MemberApplication, Long> {

    List<MemberApplication> findAllByOrganization_NameAndIsAcceptedIsFalse(String name);

    MemberApplication findByMember_Username(String username);

    MemberApplication findByOrganization_NameAndMember_Username(String org, String name);

    void deleteByMember_Username(String username);

}
