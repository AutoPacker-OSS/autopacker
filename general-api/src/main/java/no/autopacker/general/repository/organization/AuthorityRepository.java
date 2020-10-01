package no.autopacker.general.repository.organization;

import no.autopacker.general.entity.organization.Authority;
import no.autopacker.general.entity.tools.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
}
