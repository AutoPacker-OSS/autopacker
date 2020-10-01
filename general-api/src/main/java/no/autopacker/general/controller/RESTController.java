package no.autopacker.general.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import no.autopacker.general.entity.tools.Language;
import no.autopacker.general.service.LanguageService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "api/languages")
public class RESTController {

    private final LanguageService languageService;
    private ObjectMapper objectMapper;

    @Autowired
    public RESTController(LanguageService languageService, ObjectMapper objectmapper) {
        this.languageService = languageService;
        this.objectMapper = objectmapper;
    }

    /**
     * With this method the administrators can add newly supported languages and version to it's repository.
     * The request is turned will be converted into a JSONObject to extract it's values. which then creates a new
     * Language and Version Object.
     * @param httpEntity which is the head and body of a html request.
     * @return ResponseEntity with body and HttpStatus code
     */
    @PostMapping("/new")
    public ResponseEntity<String> addNewLanguage(HttpEntity<String> httpEntity){
        try{
            String body = httpEntity.getBody();
            if(body != null){
                JSONObject jsonObject = new JSONObject(body);
                String language = jsonObject.getString("language");
                int version = jsonObject.getInt("version");
                    if(languageService.addNewLanguage(language, version)) {
                        return new ResponseEntity<>("Added " + language + " with version " + version, HttpStatus.OK);
                    }
                    else {
                        return new ResponseEntity<>("Could not add " + language + " with version " + version, HttpStatus.BAD_REQUEST);
                    }
            }
            else {
                return new ResponseEntity<>("Could not add language", HttpStatus.BAD_REQUEST);
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    /**
     * This method will find and retrieve all supported programming languages as a List.
     * @return ResponseEntity with body and HttpStatus code
     */
    @GetMapping("/all")
    public ResponseEntity<String> getAllLanguages() {
        try{
            List<Language> list = this.languageService.findAllLanguages();
            return new ResponseEntity<>(this.objectMapper.writeValueAsString(list), HttpStatus.OK);
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
