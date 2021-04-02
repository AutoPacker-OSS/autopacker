package no.autopacker.api.controller.fdapi;

import no.autopacker.api.repository.fdapi.ModuleRepository;
import no.autopacker.api.service.fdapi.BuilderService;
import no.autopacker.api.service.fdapi.DockerService;
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

	@Autowired
	public BuilderController(BuilderService builderService, ModuleRepository moduleRepo, DockerService dockerService) {
		this.builderService = builderService;
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
