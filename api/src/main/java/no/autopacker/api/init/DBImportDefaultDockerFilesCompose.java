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

import java.util.Arrays;
import java.util.List;

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
     * Add dockerfiles and docker-compose into database for easier development
     * @param args
     * @throws Exception
     */
    @Override
    public void run(String... args) throws Exception {
        // List of docker-compose and Dockerfile (NOTE: file must be present in both docker-compose and dockerfiles folder)
        List<String> configTypes = Arrays.asList("java-11", "java-8", "dev-test", "angular",
            "mysql", "mysql-empty-password", "postgres", "postgres-empty-password", "react",
            "java-8-jar", "java-11-jar", "spring-boot", "staticsite", "vanilla-minecraft", "ftb-infinity-evolved", "factorio-stable");

        configTypes.forEach(type -> {
            addIfDockerFileNotExists(new Dockerfile(type, Utils.instance().getDockerFileLocation(type)));
            addIfDockerComposeNotExists(new ComposeBlock(type, Utils.instance().getDockerComposeLocation(type)));
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
