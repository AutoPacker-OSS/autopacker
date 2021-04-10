package no.autopacker.api.service.fdapi;

import no.autopacker.api.config.DockerConfig;
import no.autopacker.api.entity.fdapi.Dockerfile;
import no.autopacker.api.entity.fdapi.Module;
import no.autopacker.api.repository.fdapi.DockerfileRepository;
import no.autopacker.api.utils.fdapi.Utils;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Locale;

@Service
public class DockerService {

	private final DockerfileRepository dockerfileRepo;
	private final DockerConfig dockerConfig;
	private final Logger logger;

	@Autowired
	public DockerService(DockerfileRepository dockerfileRepo,
	                            DockerConfig dockerConfig) throws Exception {
		this.dockerfileRepo = dockerfileRepo;
		this.dockerConfig = dockerConfig;
		this.logger = LoggerFactory.getLogger(this.getClass());

		initialize();
	}


	/**
	 * Initialize the DockerService instance.
	 */
	private void initialize() {
		if (!this.isDockerInstalled()) {
			throw new BeanCreationException("Docker is not found! Please have Docker installed and make sure its " +
					"root folder is added to the user/system PATH variable.");
		}

		// Get Docker exit command of the login attempt
		int exitCode = this.loginToDocker();

		if (exitCode != 0) {
			logger.warn(String.format("Docker login command executed with a non-null exit code! Exit code: %s", exitCode));
		} else {
			logger.info("Logged into Docker as " + dockerConfig.getUsername() + "!");
		}
	}

	/**
	 * Runs the docker command to check if Docker is installed and available globally.
	 * @return  {@code true} if Docker is installed, otherwise it returns {@code false}
	 */
	private boolean isDockerInstalled() {
		boolean isInstalled;

		try {
			Runtime.getRuntime().exec(new String[]{"docker", "--help"});
			isInstalled = true;
		} catch (IOException e) {
			isInstalled = false;
		}

		return isInstalled;
	}

	/**
	 * Login to docker and store the system exit code.
	 *
	 * @return              0 (OK) if Docker is logged in or another number if login failed
	 */
	public int loginToDocker() {
		int exitCode;

		try {
			// Login to docker
			exitCode = Runtime
					.getRuntime()
					.exec(
							new String[]{"docker", "login", "--username", dockerConfig.getUsername(),
									"--password", dockerConfig.getToken(), dockerConfig.getRepository()})
					.waitFor();
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
			exitCode = -1;
		}

		return exitCode;
	}

	public void buildDockerImage(Module module, String ownerUsername) throws Exception {
		String location = module.getLocation();

		Dockerfile dockerfile = this.dockerfileRepo.findByNameIgnoreCase(module.getConfigType());

		if (dockerfile != null) {
			String dockerFileLocation = dockerfile.getLocation();

			String moduleImageName = Utils.instance().getModuleImageName(ownerUsername, module.getProject().getName().toLowerCase(), module.getName());
			Runtime cmd = Runtime.getRuntime();

			File dockerFileSource = new File(dockerFileLocation);
			File dockerFileDestination = new File(location.concat("Dockerfile"));

			// Copy dockerfile from repository and save it inside project dir with the standard name "Dockerfile"
			FileUtils.copyFile(dockerFileSource, dockerFileDestination);

			// Build docker image (the repo part format: autopacker/username-module)
			cmd.exec(new String[]{"docker", "build", "-t", dockerConfig.getUsername().concat("/").concat(moduleImageName),
					location}).waitFor();

			// Push docker image to repo
			cmd.exec(new String[]{"docker", "push", dockerConfig.getUsername() + "/" + moduleImageName}).waitFor();
		}
	}
}
