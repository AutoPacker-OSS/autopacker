package no.autopacker.filedeliveryapi.database.jdbc;

import no.autopacker.filedeliveryapi.database.ProjectRepository;
import no.autopacker.filedeliveryapi.database.mapper.ProjectRowMapper;
import no.autopacker.filedeliveryapi.domain.ProjectMeta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcProjectRepository implements ProjectRepository {
	private final JdbcTemplate jdbc;
	private final RowMapper<ProjectMeta> projectMapper;

	@Autowired
	public JdbcProjectRepository(JdbcTemplate jdbc) {
		this.jdbc = jdbc;
		projectMapper = new ProjectRowMapper();
	}

	@Override
	public void save(ProjectMeta pm) {
		String query = "INSERT INTO projects (image, name, `desc`, last_updated, tags, website, isPrivate, owner, location) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		jdbc.update(query, pm.getImage(), pm.getProjectName(), pm.getDesc(), pm.getLastUpdated(),
				pm.getTags(), pm.getWebsite(), pm.isPrivate(), pm.getOwner(), pm.getLocation());
	}

	@Override
	public void delete(long id) {
		String query = "DELETE FROM projects WHERE id = ?";
		jdbc.update(query, id);
	}

	@Override
	public ProjectMeta findById(long id) {
		String query = "SELECT * FROM projects WHERE id = ? LIMIT 1";
		ProjectMeta pm = null;

		try {
			pm = jdbc.queryForObject(query, new Object[]{id}, projectMapper);
		} catch (EmptyResultDataAccessException e) {}

		return pm;
	}

	@Override
	public ProjectMeta findByOwnerAndName(String owner, String name) {
		String query = "SELECT * FROM projects WHERE name = ? AND owner = ?";
		ProjectMeta pm = null;

		try {
			pm = jdbc.queryForObject(query, new Object[]{name, owner}, projectMapper);
		} catch (EmptyResultDataAccessException e) {}

		return pm;
	}

	public ProjectMeta findByOwnerAndProjectId(String owner, Long id) {
		String query = "SELECT * FROM projects WHERE owner = ? AND id = ? AND isPrivate = false LIMIT 1";
		ProjectMeta pm = null;

		try {
			pm = jdbc.queryForObject(query, new Object[]{owner, id}, projectMapper);
		} catch (EmptyResultDataAccessException e) {}

		return pm;
	}

	@Override
	public List<ProjectMeta> findAllByOwner(String owner) {
		String query = "SELECT * FROM projects WHERE owner = ?";
		return jdbc.query(query, new Object[]{owner}, projectMapper);
	}

	@Override
	public List<ProjectMeta> searchAllProjectsUserOwns(String owner, String search) {
		String query = "SELECT * FROM projects WHERE owner = ? AND LOWER(name) LIKE CONCAT('%', LOWER(?), '%')";
		return jdbc.query(query, new Object[]{owner, search}, projectMapper);
	}

	@Override
	public List<ProjectMeta> findAllPublicProjects() {
		String query = "SELECT * FROM projects WHERE isPrivate = false";
		return jdbc.query(query, projectMapper);
	}

	@Override
	public List<ProjectMeta> searchAllPublicProjects(String search) {
		String query = "SELECT * FROM projects WHERE isPrivate = false AND LOWER(name) LIKE CONCAT('%', LOWER(?), '%')";
		return jdbc.query(query, new Object[]{search}, projectMapper);
	}

	@Override
	public List<ProjectMeta> findAll() {
		String query = "SELECT * FROM projects";
		return jdbc.query(query, projectMapper);
	}

	@Override
	public List<ProjectMeta> findAllPublicProjectsForUser(String username) {
		String query = "SELECT * FROM projects WHERE isPrivate = false AND owner = ?";
		return jdbc.query(query, new Object[]{username}, projectMapper);
	}

	@Override
	public List<ProjectMeta> searchAllPublicProjectsForUser(String username, String search) {
		String query = "SELECT * FROM projects WHERE isPrivate = false AND owner = ? AND LOWER(name) LIKE CONCAT('%', LOWER(?), '%')";
		return jdbc.query(query, new Object[]{username, search}, projectMapper);
	}
}
