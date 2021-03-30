package no.autopacker.filedeliveryapi.database.mapper;

import no.autopacker.filedeliveryapi.domain.Dockerfile;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class DockerfileRowMapper implements RowMapper<Dockerfile> {
    @Override
    public Dockerfile mapRow(ResultSet resultSet, int i) throws SQLException {
        return new Dockerfile(
                resultSet.getLong("id"),
                resultSet.getString("name"),
                resultSet.getString("location")
        );
    }
}
