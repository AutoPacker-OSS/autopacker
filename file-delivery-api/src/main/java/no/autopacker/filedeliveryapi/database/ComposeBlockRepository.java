package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.ComposeBlock;

public interface ComposeBlockRepository {
    void save(ComposeBlock composeBlock);
    void delete(Long id);
    ComposeBlock findByName(String name);
}
