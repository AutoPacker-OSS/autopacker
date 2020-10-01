package no.autopacker.filedeliveryapi.database.mapper;


import no.autopacker.filedeliveryapi.domain.ProjectMeta;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectRowMapper implements RowMapper<ProjectMeta> {
	@Override
	public ProjectMeta mapRow(ResultSet rs, int i) throws SQLException {
		ProjectMeta pm = new ProjectMeta();

		pm.setId(rs.getLong("id"));
		pm.setProjectName(rs.getString("name"));
		// Description
		if (rs.getString("desc") == null) {
			pm.setDesc("");
		} else {
			pm.setDesc(rs.getString("desc"));
		}
		// Image
		if (rs.getString("image") == null) {
			pm.setImage("");
		} else {
			pm.setImage(rs.getString("image"));
		}
		pm.setLastUpdated(rs.getDate("last_updated"));
		// Tags
		if (rs.getString("tags") == null) {
			pm.setTags("");
		} else {
			pm.setTags(rs.getString("tags"));
		}
		// Website
		if (rs.getString("Website") == null) {
			pm.setWebsite("");
		} else {
			pm.setWebsite(rs.getString("Website"));
		}
		pm.setPrivate(rs.getBoolean("isPrivate"));
		pm.setOwner(rs.getString("owner"));
		pm.setLocation(rs.getString("location"));

		return pm;
	}
}
