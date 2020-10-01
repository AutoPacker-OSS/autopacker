package no.autopacker.general.repository.tools;

import no.autopacker.general.entity.tools.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersionRepository extends JpaRepository<Version, Long> {

    Version findAllByVersion(String version);
}
