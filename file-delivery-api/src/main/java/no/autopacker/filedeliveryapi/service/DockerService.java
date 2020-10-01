package no.autopacker.filedeliveryapi.service;

import no.autopacker.filedeliveryapi.FileDeliveryApiApplication;
import no.autopacker.filedeliveryapi.config.DockerConfig;
import no.autopacker.filedeliveryapi.database.DockerfileRepository;
import no.autopacker.filedeliveryapi.domain.ModuleMeta;
import no.autopacker.filedeliveryapi.domain.ProjectMeta;
import no.autopacker.filedeliveryapi.utils.Utils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class DockerService {

	private DockerfileRepository dockerfileRepo;
	private DockerConfig dockerConfig;

	@Autowired
	public DockerService(DockerfileRepository dockerfileRepo,
				DockerConfig dockerConfig) throws Exception {
		this.dockerfileRepo = dockerfileRepo;
		this.dockerConfig = dockerConfig;
		loginToDocker();
	}

	private void loginToDocker() throws Exception {
		if (System.getProperty("os.name").contains("Linux")) {
			// Login to docker
			Runtime
				.getRuntime()
				.exec(
					new String[]{"docker", "login", "--username", dockerConfig.getUsername(),
						"--password", dockerConfig.getToken(), dockerConfig.getRepository()})
				.waitFor();

			LoggerFactory.getLogger(FileDeliveryApiApplication.class).info("Logged into docker as "
				+ dockerConfig.getUsername());
		}
	}

	public void buildDockerImage(ModuleMeta module, String ownerUsername) throws Exception {
		if (System.getProperty("os.name").contains("Linux")) {
			String location = module.getLocation();

			String dockerFileLocation = dockerfileRepo.findByName(module.getConfigType()).getLocation();

			String moduleImageName = Utils.instance().getModuleImageName(ownerUsername, module.getName());
			Runtime cmd = Runtime.getRuntime();

			// Copy dockerfile from repository and save it inside project dir with the standard name "Dockerfile"
			cmd.exec(new String[]{"cp", dockerFileLocation, location.concat("Dockerfile")}).waitFor();

			// Build docker image (the repo part format: kullsyre/username-module)
			cmd.exec(new String[]{"docker", "build", "-t", dockerConfig.getUsername().concat("/").concat(moduleImageName), location}).waitFor();

			// Push docker image to repo
			cmd.exec(new String[]{"docker", "push", dockerConfig.getUsername() + "/" + moduleImageName}).waitFor();
		} else {
			LoggerFactory.getLogger(FileDeliveryApiApplication.class).error("Docker image creation failed: Can't use docker in Windows.");
		}
	}
}
