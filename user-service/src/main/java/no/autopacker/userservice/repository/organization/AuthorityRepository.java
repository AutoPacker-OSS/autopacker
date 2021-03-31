package no.autopacker.userservice.repository.organization;

import no.autopacker.userservice.entity.organization.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
}
