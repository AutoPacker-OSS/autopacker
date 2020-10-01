package no.autopacker.filedeliveryapi.database.mapper;

import no.autopacker.filedeliveryapi.domain.ModuleMeta;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ModuleRowMapper implements RowMapper<ModuleMeta> {
	@Override
	public ModuleMeta mapRow(ResultSet rs, int i) throws SQLException {
		ModuleMeta mm = new ModuleMeta();

		// Base
		mm.setId(rs.getLong("id"));
		mm.setName(rs.getString("name"));
		mm.setDesc(rs.getString("desc"));
		mm.setLocation(rs.getString("location"));
		mm.setProjectId(rs.getLong("project_id"));

		// Additional
		mm.setImage(rs.getString("image"));
		mm.setPort(rs.getInt("port"));
		mm.setFramework(rs.getString("framework"));
		mm.setLanguage(rs.getString("language"));
		mm.setVersion(rs.getString("version"));
		mm.setConfigType(rs.getString("config_type"));


		return mm;
	}
}
