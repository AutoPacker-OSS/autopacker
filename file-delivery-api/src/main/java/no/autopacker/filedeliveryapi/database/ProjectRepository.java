package no.autopacker.filedeliveryapi.database;

import no.autopacker.filedeliveryapi.domain.ProjectMeta;

import java.util.List;

public interface ProjectRepository {
	void save(ProjectMeta pm);
	void delete(long id);

	ProjectMeta findById(long id);
	ProjectMeta findByOwnerAndName(String owner, String name);

	List<ProjectMeta> findAllByOwner(String owner);

	List<ProjectMeta> findAllPublicProjects();
	List<ProjectMeta> searchAllPublicProjects(String search);
	ProjectMeta findByOwnerAndProjectId(String owner, Long id);
	List<ProjectMeta> searchAllProjectsUserOwns(String owner, String search);
	List<ProjectMeta> findAll();

	List<ProjectMeta> findAllPublicProjectsForUser(String username);

	List<ProjectMeta> searchAllPublicProjectsForUser(String username, String search);

}
