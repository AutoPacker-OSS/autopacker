package no.autopacker.filedeliveryapi;

import no.autopacker.filedeliveryapi.utils.Utils;
import org.apache.commons.io.IOUtils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

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
