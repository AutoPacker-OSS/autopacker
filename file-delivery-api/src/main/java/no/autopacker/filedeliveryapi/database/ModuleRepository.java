package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.ModuleMeta;

import java.util.List;

public interface ModuleRepository {
	void save(ModuleMeta moduleMeta);
	void delete(long id);
	ModuleMeta findModuleById(long id);
	List<ModuleMeta> findAll();
	List<ModuleMeta> findAllModulesByProjectId(long id);
	List<ModuleMeta> findAllModulesByUsernameAndProjectName(String username, String projectName);
	ModuleMeta findModuleByUsernameAndProjectNameAndModuleName(String username, String projectName, String moduleName);
	ModuleMeta findModuleByProjectIdAndName(long projectId, String name);
	boolean moduleExists(long projectId, String name);
}
