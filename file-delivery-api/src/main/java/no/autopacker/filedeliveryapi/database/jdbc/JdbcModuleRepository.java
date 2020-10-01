package no.autopacker.filedeliveryapi.database.jdbc;

import no.autopacker.filedeliveryapi.database.ModuleRepository;
import no.autopacker.filedeliveryapi.database.ProjectRepository;
import no.autopacker.filedeliveryapi.database.mapper.ModuleRowMapper;
import no.autopacker.filedeliveryapi.domain.ModuleMeta;
import no.autopacker.filedeliveryapi.domain.ProjectMeta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcModuleRepository implements ModuleRepository {
	private final JdbcTemplate jdbc;
	private final ProjectRepository projectRepo;
	private final RowMapper<ModuleMeta> mapper;

	@Autowired
	public JdbcModuleRepository(JdbcTemplate jdbc, ProjectRepository projectRepo) {
		this.jdbc = jdbc;
		this.projectRepo = projectRepo;
		this.mapper = new ModuleRowMapper();
	}

	@Override
	public void save(ModuleMeta mm) {
		String query = "INSERT INTO modules (name, `desc`, image, port, framework, language , version, config_type, location, project_id) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		jdbc.update(query, mm.getName(), mm.getDesc(), mm.getImage(), mm.getPort(), mm.getFramework(), mm.getLanguage(),
				mm.getVersion(), mm.getConfigType(), mm.getLocation(), mm.getProjectId());
	}

	@Override
	public void delete(long id) {
		String query = "DELETE FROM modules WHERE id = ?";
		jdbc.update(query, id);
	}

	@Override
	public ModuleMeta findModuleById(long id) {
		String query = "SELECT * FROM modules WHERE id = ?";
		ModuleMeta mm = null;

		try {
			mm = jdbc.queryForObject(query, new Object[]{id}, mapper);
		} catch (EmptyResultDataAccessException e) {}

		return mm;
	}

	@Override
	public List<ModuleMeta> findAll() {
		String query = "SELECT * FROM modules";
		return jdbc.query(query, mapper);
	}

	@Override
	public List<ModuleMeta> findAllModulesByProjectId(long id) {
		String query = "SELECT * FROM modules WHERE project_id = ?";
		return jdbc.query(query, new Object[]{id}, mapper);
	}

	@Override
	public List<ModuleMeta> findAllModulesByUsernameAndProjectName(String username, String projectName) {
		ProjectMeta pm = projectRepo.findByOwnerAndName(username, projectName);
		String query = "SELECT * FROM modules WHERE project_id = ?";
		return jdbc.query(query, new Object[]{pm.getId()}, mapper);
	}

	@Override
	public ModuleMeta findModuleByUsernameAndProjectNameAndModuleName(String username,
	                                                                  String projectName, String moduleName) {
		ProjectMeta pm = projectRepo.findByOwnerAndName(username, projectName);
		String query = "SELECT * FROM modules WHERE project_id = ? AND name = ?";

		ModuleMeta mm = null;

		try {
			mm = jdbc.queryForObject(query, new Object[]{pm.getId(), moduleName}, mapper);
		} catch (EmptyResultDataAccessException e) {}

		return mm;
	}

	@Override
	public ModuleMeta findModuleByProjectIdAndName(long projectId, String name) {
		String query = "SELECT * FROM modules WHERE project_id = ? AND name = ?";
		ModuleMeta mm = null;

		try {
			mm = jdbc.queryForObject(query, new Object[]{projectId, name}, mapper);
		} catch (EmptyResultDataAccessException e) {}

		return mm;
	}

	@Override
	public boolean moduleExists(long projectId, String name) {
		Long id = 0L; // Default value for non existing module
		String query = "SELECT id FROM modules WHERE project_id = ? AND name = ? LIMIT 1";

		try {
			id = jdbc.queryForObject(query, new Object[]{projectId, name}, Long.class);
		} catch (EmptyResultDataAccessException e) {}

		return (id > 0);
	}
}
