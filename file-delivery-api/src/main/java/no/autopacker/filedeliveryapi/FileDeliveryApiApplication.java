package no.autopacker.filedeliveryapi;

import no.autopacker.filedeliveryapi.utils.Utils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;

@SpringBootApplication
public class FileDeliveryApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(FileDeliveryApiApplication.class, args);
	}

	@Bean
	MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize(DataSize.ofBytes(512000000L));
		factory.setMaxRequestSize(DataSize.ofBytes(512000000L));
		return factory.createMultipartConfig();
	}

	@Bean
	CommandLineRunner init() {
		return (args) -> {
			Utils utils = Utils.instance();

			// Create storage folders
			utils.createDirIfNotExists(utils.getRootDirectory());
			utils.createDirIfNotExists(utils.getUserWorkspace());
			utils.createDirIfNotExists(utils.getDockerFileTemplateDir());
			utils.createDirIfNotExists(utils.getDockerComposeTemplateDir());
		};
	}
}
