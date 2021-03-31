package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.ModuleMeta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ModuleRepository extends CrudRepository<ModuleMeta, Long> {
    Set<ModuleMeta> findAllByProjectId(long id);

    @Query(value = "SELECT m.* FROM modules m JOIN projects p ON m.project_id = p.id WHERE p.owner = ?1 AND p.name = ?2",
            nativeQuery = true)
    Set<ModuleMeta> findForProject(String projectOwner, String projectName);

    @Query(value = "SELECT m.* FROM modules m JOIN projects p ON m.project_id = p.id WHERE p.owner = ?1 AND p.name = ?2 AND m.name = ?3",
            nativeQuery = true)
    ModuleMeta findForProject(String projectOwner, String projectName, String moduleName);

    long countByProjectIdAndName(long projectId, String name);

    ModuleMeta findByProjectIdAndName(long projectId, String name);
}
