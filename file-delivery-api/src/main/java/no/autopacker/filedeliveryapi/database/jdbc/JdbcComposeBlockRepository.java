package no.autopacker.filedeliveryapi.database.jdbc;

import no.autopacker.filedeliveryapi.database.ComposeBlockRepository;
import no.autopacker.filedeliveryapi.database.mapper.ComposeBlockRowMapper;
import no.autopacker.filedeliveryapi.domain.ComposeBlock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcComposeBlockRepository implements ComposeBlockRepository {

    private final JdbcTemplate jdbc;
    private final RowMapper<ComposeBlock> composeBlockRowMapper;

    @Autowired
    public JdbcComposeBlockRepository(JdbcTemplate jdbcTemplate) {
        this.jdbc = jdbcTemplate;
        this.composeBlockRowMapper = new ComposeBlockRowMapper();
    }

    @Override
    public void save(ComposeBlock cb) {
        String query = "INSERT INTO compose_blocks (name, location) VALUES (?, ?)";
        jdbc.update(query, cb.getName(), cb.getLocation());
    }

    @Override
    public void delete(Long id) {
        String query = "DELETE FROM compose_blocks WHERE id = ? LIMIT 1";
        jdbc.update(query, id);
    }

    @Override
    public ComposeBlock findByName(String name) {
        String query = "SELECT * FROM compose_blocks WHERE LOWER(name) = LOWER(?) LIMIT 1";
        try {
            return jdbc.queryForObject(query, new Object[]{name}, composeBlockRowMapper);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}
