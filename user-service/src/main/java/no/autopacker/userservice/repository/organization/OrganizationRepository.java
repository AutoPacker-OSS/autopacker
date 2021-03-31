package no.autopacker.userservice.repository.organization;

import java.util.List;

import no.autopacker.userservice.entity.organization.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Organization findByName(String name);

    Organization findByNameIgnoreCase(String name);

    List<Organization> findAllByNameContaining(String search);

    List<Organization> findOrganizationsByMembersUsernameAndMembersIsEnabled(String username,
        boolean isEnabled);

    List<Organization> findOrganizationsByMembersUsernameAndMembersIsEnabledAndNameContaining(
        String username, boolean isEnabled, String search);

}
