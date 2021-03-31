package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.ComposeBlock;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComposeBlockRepository extends CrudRepository<ComposeBlock, Long> {
    ComposeBlock findByNameIgnoreCase(String name);
}
