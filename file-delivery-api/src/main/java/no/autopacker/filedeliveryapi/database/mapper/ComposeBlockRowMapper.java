package no.autopacker.filedeliveryapi.database.mapper;

import no.autopacker.filedeliveryapi.domain.ComposeBlock;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ComposeBlockRowMapper implements RowMapper<ComposeBlock> {
    @Override
    public ComposeBlock mapRow(ResultSet resultSet, int i) throws SQLException {
        return new ComposeBlock(
                resultSet.getLong("id"),
                resultSet.getString("name"),
                resultSet.getString("location")
        );
    }
}
