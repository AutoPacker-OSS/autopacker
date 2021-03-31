package no.autopacker.api.repository.fdapi;

import no.autopacker.api.entity.fdapi.Module;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends CrudRepository<Module, Long> {
    List<Module> findAllByProjectId(long id);

    @Query(value = "SELECT m.* FROM module m JOIN project p ON m.project_id = p.id WHERE p.owner = ?1 AND p.name = ?2",
            nativeQuery = true)
    List<Module> findForProject(String projectOwner, String projectName);

    @Query(value = "SELECT m.* FROM module m JOIN project p ON m.project_id = p.id WHERE p.owner = ?1 AND p.name = ?2 AND m.name = ?3",
            nativeQuery = true)
    Module findForProject(String projectOwner, String projectName, String moduleName);

    long countByProjectIdAndName(long projectId, String name);

    Module findByProjectIdAndName(long projectId, String name);
}
