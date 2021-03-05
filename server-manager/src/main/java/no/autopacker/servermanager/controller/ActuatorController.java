package no.autopacker.servermanager.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.boot.actuate.health.Health;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "actuator/server")
public class ActuatorController {

    private final Path infoLogPath = FileSystems.getDefault().getPath("./src/main/resources/logs", "spring.log");
    private final Charset charset = StandardCharsets.UTF_8;
    private final ArrayList<String> logList;

    public ActuatorController() {
        this.logList = new ArrayList<>();
    }

    @GetMapping("/logs/preview")
    public List<String> getInfoLog() {
        try (BufferedReader reader = Files.newBufferedReader(infoLogPath, charset)) {
            String line;
            while (((line = reader.readLine()) != null)) {
                this.logList.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        List<String> logListToSend;
        if (this.logList.size() > 100) {
            logListToSend = this.logList.subList(this.logList.size() - 100, this.logList.size());
        } else {
            logListToSend = this.logList;
        }
        return logListToSend;
    }

    @GetMapping(
            value = "logs",
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public @ResponseBody
    byte[] getLog() throws IOException {
        InputStream in = Files.newInputStream(infoLogPath);
        return IOUtils.toByteArray(in);
    }

    @GetMapping(value = "health")
    public Health getHealth() {
        try {
            return Health.up().build();
        } catch (Exception e) {
            return Health.down().build();
        }
    }
}