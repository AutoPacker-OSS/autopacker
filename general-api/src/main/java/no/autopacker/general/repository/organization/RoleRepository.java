package no.autopacker.general.repository.organization;

import no.autopacker.general.entity.organization.Role;
import no.autopacker.general.entity.tools.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);

}
