package no.autopacker.userservice.controller.fdapi;

import no.autopacker.userservice.repository.fdapi.ModuleRepository;
import no.autopacker.userservice.repository.organization.OrganizationProjectRepository;
import no.autopacker.userservice.service.fdapi.BuilderService;
import no.autopacker.userservice.service.fdapi.DockerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * This class is responsible of taking resource calls for building the docker compose files.
 */
@RestController
public class BuilderController {
	private final BuilderService builderService;
	private final OrganizationProjectRepository projectRepo;
	private final ModuleRepository moduleRepo;
	private final DockerService dockerService;

	@Autowired
	public BuilderController(BuilderService builderService, OrganizationProjectRepository projectRepo, ModuleRepository moduleRepo, DockerService dockerService) {
		this.builderService = builderService;
		this.projectRepo = projectRepo;
		this.moduleRepo = moduleRepo;
		this.dockerService = dockerService;
	}

	/**
	 * Add a new Dockerfile template to the API.
	 * @param tempName                  name of the template (ex: java-11)
	 * @param uploadedTemplateFile      the DockerFile to upload
	 * @return                          success/error based on if the template file was added or not
	 */
	@RequestMapping(value = "/templates/dockerfile/add", method = RequestMethod.POST, consumes = "multipart/form-data")
	public ResponseEntity addDockerFileTemplate(@RequestParam("name") String tempName,
	                                  @RequestParam("temp-file") MultipartFile uploadedTemplateFile) {
		return builderService.addTemplateFile("dockerfile", tempName, uploadedTemplateFile);
	}

	/**
	 * Add a new docker-compose template to the API.
	 * @param tempName                  name of the template (ex: java-11)
	 * @param uploadedTemplateFile      the DockerFile to upload
	 * @return                          success/error based on if the template file was added or not
	 */
	@RequestMapping(value = "/templates/docker-compose/add", method = RequestMethod.POST, consumes = "multipart/form-data")
	public ResponseEntity addDockerComposeTemplate(@RequestParam("name") String tempName,
	                                  @RequestParam("temp-file") MultipartFile uploadedTemplateFile) {
		return builderService.addTemplateFile("docker-compose", tempName, uploadedTemplateFile);
	}
}
