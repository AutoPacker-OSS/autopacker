package no.autopacker.api.repository.organization;

import no.autopacker.api.entity.User;
import no.autopacker.api.entity.organization.MemberApplication;
import no.autopacker.api.entity.organization.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberApplicationRepository extends JpaRepository<MemberApplication, Long> {
    @Query(value = "SELECT m.* FROM member_application m INNER JOIN organization o ON m.organization_id = o.id " +
            "WHERE o.name = ?1 AND is_accepted = false",
            nativeQuery = true)
    List<MemberApplication> findAllActive(String organizationName);

    MemberApplication findByOrganizationAndUser(Organization organization, User user);
}
