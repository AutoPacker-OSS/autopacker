package no.autopacker.filedeliveryapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "actuator/fdapi")
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
            while (((line = reader.readLine()) != null)){
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

}
