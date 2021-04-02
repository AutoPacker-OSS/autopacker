package no.autopacker.api.init;

import no.autopacker.api.entity.fdapi.ComposeBlock;
import no.autopacker.api.entity.fdapi.Dockerfile;
import no.autopacker.api.repository.fdapi.ComposeBlockRepository;
import no.autopacker.api.repository.fdapi.DockerfileRepository;
import no.autopacker.api.utils.fdapi.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Order(value = 1)
public class DBImportDefaultDockerFilesCompose implements CommandLineRunner {
    private final DockerfileRepository dockerfileRepo;
    private final ComposeBlockRepository composeRepo;

    @Autowired
    public DBImportDefaultDockerFilesCompose(DockerfileRepository dockerfileRepo, ComposeBlockRepository composeRepo) {
        this.dockerfileRepo = dockerfileRepo;
        this.composeRepo = composeRepo;
    }

    /**
     * Add dockerfiles and docker-compose into database for easier development. It searches through the docker folders
     * inside ./data/templates/ to fetch all file names and inserts them into the database.
     *
     * @param args              ignored.
     * @throws IOException      when docker folders could not be found
     */
    @Override
    public void run(String... args) throws IOException {
        // Target docker-compose/dockerfile prefix and file extensions
        String extAndPrefixRegex = "^([\\w-]*)\\.Dockerfile$|^docker-compose-([\\w-]*)\\.yml$";

        // Dockerfile
        Path dockerFilePath = new File(Utils.instance().getDockerFileTemplateDir()).toPath();

        Files.list(dockerFilePath).forEach(file -> {
            String fileName = file.getFileName().toString();

            // Remove file extension and prefixes
            fileName = fileName.replaceAll(extAndPrefixRegex, "$1$2");
            addIfDockerFileNotExists(new Dockerfile(fileName, Utils.instance().getDockerFileLocation(fileName)));
        });

        // Docker-compose
        Path dockerComposePath = new File(Utils.instance().getDockerComposeTemplateDir()).toPath();

        Files.list(dockerComposePath).forEach(file -> {
            String fileName = file.getFileName().toString();

            // Remove file extension and prefixes
            fileName = fileName.replaceAll(extAndPrefixRegex, "$1$2");
            addIfDockerComposeNotExists(new ComposeBlock(fileName, Utils.instance().getDockerComposeLocation(fileName)));
        });
    }

    /**
     * Add Dockerfile reference if it doesn't exist in database
     * @param entry     Dockerfile
     */
    public void addIfDockerFileNotExists(Dockerfile entry) {
        if (dockerfileRepo.findByNameIgnoreCase(entry.getName()) == null) {
            dockerfileRepo.save(entry);
        }
    }

    /**
     * Add docker-compose reference if it doesn't exist in database
     * @param entry     docker-compose
     */
    public void addIfDockerComposeNotExists(ComposeBlock entry) {
        if (composeRepo.findByNameIgnoreCase(entry.getName()) == null) {
            composeRepo.save(entry);
        }
    }
}
