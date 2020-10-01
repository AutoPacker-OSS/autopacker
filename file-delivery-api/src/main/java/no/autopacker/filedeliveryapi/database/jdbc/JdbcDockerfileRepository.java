package no.autopacker.filedeliveryapi.database.jdbc;

import no.autopacker.filedeliveryapi.database.DockerfileRepository;
import no.autopacker.filedeliveryapi.database.mapper.DockerfileRowMapper;
import no.autopacker.filedeliveryapi.domain.Dockerfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcDockerfileRepository implements DockerfileRepository {

    private final JdbcTemplate jdbc;
    private final RowMapper<Dockerfile> dockerfileRowMapper;

    @Autowired
    public JdbcDockerfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbc = jdbcTemplate;
        this.dockerfileRowMapper = new DockerfileRowMapper();
    }

    @Override
    public void save(Dockerfile dockerfile) {
        String query = "INSERT INTO dockerfiles (name, location) VALUES (?, ?)";
        jdbc.update(query, dockerfile.getName(), dockerfile.getLocation());
    }

    @Override
    public void delete(Long id) {
        String query = "DELETE FROM dockerfiles WHERE id = ? LIMIT 1";
        jdbc.update(query, id);
    }

    @Override
    public Dockerfile findByName(String name) {
        String query = "SELECT * FROM dockerfiles WHERE LOWER(name) = LOWER(?) LIMIT 1";
        try {
            return jdbc.queryForObject(query, new Object[]{name}, dockerfileRowMapper);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}
