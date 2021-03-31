package no.autopacker.api.service.fdapi;

import no.autopacker.api.config.DockerConfig;
import no.autopacker.api.domain.ComposeBlock;
import no.autopacker.api.domain.Dockerfile;
import no.autopacker.api.domain.ModuleMeta;
import no.autopacker.api.repository.fdapi.ComposeBlockRepository;
import no.autopacker.api.repository.fdapi.DockerfileRepository;
import no.autopacker.api.utils.fdapi.Utils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BuilderService {

	private final DockerfileRepository dockerfileRepo;
	private final ComposeBlockRepository composeRepo;
	private final DockerConfig dockerConfig;

	@Autowired
	public BuilderService(DockerfileRepository dockerfileRepo,
		ComposeBlockRepository composeRepo, DockerConfig dockerConfig) {
		this.dockerfileRepo = dockerfileRepo;
		this.composeRepo = composeRepo;
		this.dockerConfig = dockerConfig;
	}

	/**
	 * Uploads a dockerfile or docker-compose file to the API and stores it under their representative folders.
	 *
	 * @param type                      the type of file uploaded, either docker-compose or dockerfile
	 * @param tempName                  the name of the file (excluding the format type, i.e. .xml)
	 * @param uploadedTemplateFile      the file to upload
	 * @return
	 */
	public ResponseEntity addTemplateFile(String type, String tempName, MultipartFile uploadedTemplateFile) {
		ResponseEntity response;

		// Absolute path of the template file
		String location;

		if (type.equals("docker-compose")) {
			if (composeRepo.findByNameIgnoreCase(tempName) == null) {
				location = Utils.instance().getDockerComposeTemplateDir() + "-" + tempName + ".yml";

				// Save to database
				ComposeBlock block = new ComposeBlock(tempName, location);
				composeRepo.save(block);
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Template already exists: " + tempName);
			}
		} else if (type.equals("dockerfile")) {
			if (dockerfileRepo.findByNameIgnoreCase(tempName) == null) {
				location = Utils.instance().getDockerFileLocation(tempName);

				// Save to database
				Dockerfile dockerfile = new Dockerfile(tempName, location);
				dockerfileRepo.save(dockerfile);
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Template already exists: " + tempName);
			}
		} else {
			return ResponseEntity.badRequest().body("Type file is invalid: Must be docker-compose or dockerfile");
		}

		File templateFile = new File(location);

		try {
			// Write uploaded template file to disk
			FileOutputStream fos = new FileOutputStream(templateFile);
			IOUtils.copy(uploadedTemplateFile.getInputStream(), fos);
			fos.close();
		} catch (IOException ioe) {
			ioe.printStackTrace();
			response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Couldn't upload template");
		}

		response = ResponseEntity.ok("Template added");
		return response;
	}

	/**
	 * Takes in the template content as string and replaces the placeholder with the values from the JSON object.
	 * NOTE: The placeholder keys and the json object key must be the same for the placeholder you want to switch out.
	 *
	 * @param templateContent   template content
	 * @param json              json object with all the values
	 * @param validate			if true, this switch casts an exception when all placeholders has not been replaced
	 * @return                  a string with the template content replaced with the values from json
	 * @throws JSONException    if json data couldn't be processed
	 */
	public String buildFromTemplate(String templateContent, JSONObject json, boolean validate) throws JSONException {
		// Format: ${VARIABLE} and its case-insensitive
		Pattern pattern = Pattern.compile("\\$\\{(\\w*)\\}");
		Matcher m = pattern.matcher(templateContent);
		StringBuilder result = new StringBuilder();

		while (m.find()) {
			String key = m.group(1);
			String value = null;

			if (json.has(key.toLowerCase())) {
				value = json.getString(key.toLowerCase());
			} else if (json.has(key.toUpperCase())) {
				value = json.getString(key.toUpperCase());
			}

			if (value != null) {
				m.appendReplacement(result, Matcher.quoteReplacement(value));
			}
		}

		m.appendTail(result);

		// Check if placeholders weren't replaced and throw exception if so
		if (result.toString().contains("${") && validate) {
			throw new JSONException("All placeholder values has not been assigned");
		}

		return result.toString();
	}

	public String compileModuleComposeBlock(ModuleMeta module,
											Map<String, Object> composeParams, String projectOwner) throws Exception {
		// Import the templates
		String componentTemplateLocation = composeRepo.findByNameIgnoreCase(module.getConfigType()).getLocation();
		String componentTemplate = FileUtils.readFileToString(new File(componentTemplateLocation), "utf-8");

		// Get the docker image name
		String moduleImageName = Utils.instance().getModuleImageName(projectOwner, module.getName());

		JSONObject params = new JSONObject(composeParams);
		params.put("IMAGE_NAME", dockerConfig.getUsername().concat("/") + moduleImageName + ":latest");
		params.put("CONTAINER_NAME", moduleImageName);
		params.put("CONFIG_TYPE", module.getConfigType());
		return buildFromTemplate(componentTemplate, params, false);
	}
}
