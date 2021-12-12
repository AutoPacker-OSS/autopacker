package no.autopacker.api.utils.fdapi;

import lombok.Data;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

@Data
public class Utils {

	private static Utils instance;

	@Bean
	public static Utils instance() {
		if (instance == null) {
			instance = new Utils();
		}

		return instance;
	}
	/**
	 * Location of all misc files
	 */
	private String rootDirectory = System.getProperty("user.dir") + File.separator + "data" + File.separator;

	/**
	 * Location of users projects
	 */
	private String userWorkspace = rootDirectory + "workspace" + File.separator;

	/**
	 * Location of all Dockerfiles for each module
	 */
	private String dockerFileTemplateDir = rootDirectory + "templates" + File.separator + "dockerfiles" + File.separator;

	/**
	 * Location of all modulated docker compose templates
	 */
	private String dockerComposeTemplateDir = rootDirectory + "templates" + File.separator + "docker-compose" + File.separator;

	/**
	 * Location of user generated docker-compose files including their custom variables
	 */
	private String generatedDockerComposeDir = dockerComposeTemplateDir + "generated" + File.separator;
	/**
	 * Return absolute path of the project directory of the user.
	 *
	 * @param userId        the owners id of the project
	 * @param projectName   name of the project
	 * @return              project directory
	 */
	public String getUserProjectDir(String userId, String projectName) {
		return userWorkspace + userId + File.separator + projectName + File.separator;
	}

	public void validateUserWorkspace(String userId) {
		String userWorkspacePath = userWorkspace.concat(userId);
		if (!Files.exists(new File(userWorkspacePath).toPath(), LinkOption.NOFOLLOW_LINKS)) {
			new File(userWorkspacePath).mkdir();
		}
	}

	/**
	 * Creates directory if it doesn't exist. This prevents errors when the API tries to create a file into a
	 * non-existing directory.
	 * @param dir   the directory to validate
	 */
	public boolean createDirIfNotExists(String dir) {
		boolean isSuccessful = false;

		if (!Files.exists(new File(dir).toPath(), LinkOption.NOFOLLOW_LINKS)) {
			isSuccessful = new File(dir).mkdirs();
		} else {
			// Directory exists
			isSuccessful = true;
		}

		return isSuccessful;
	}

	public String getModuleImageName(String projectOwner, String projectName, String moduleName) {
		return projectOwner + "-" + projectName + "-" + moduleName;
	}

	public String getRootDirectory() {
		return rootDirectory;
	}

	public String getDockerFileTemplateDir() {
		return dockerFileTemplateDir;
	}

	public String getDockerComposeTemplateDir() {
		return dockerComposeTemplateDir;
	}

	public String getDockerFileLocation(String type) {
		return dockerFileTemplateDir + type + ".Dockerfile";
	}

	public boolean hasRole(Authentication authUser, String roleName) {
		boolean roleFound = false;

		for (GrantedAuthority auth : authUser.getAuthorities()) {
			if (auth.getAuthority().equalsIgnoreCase(roleName)) {
				roleFound = true;
			}
		}

		return roleFound;
	}

	public String getDockerComposeLocation(String type) {
		return dockerComposeTemplateDir + "docker-compose-" + type + ".yml";
	}

	public String getGeneratedDockerComposeLocation(long id) {
		return generatedDockerComposeDir + id + ".yml";
	}
}
