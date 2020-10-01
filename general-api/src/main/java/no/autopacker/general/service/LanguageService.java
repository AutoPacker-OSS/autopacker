package no.autopacker.general.service;

import no.autopacker.general.entity.tools.Language;
import no.autopacker.general.repository.tools.LanguageRepository;
import no.autopacker.general.repository.tools.VersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LanguageService {

    private LanguageRepository languageRepository;
    private VersionRepository versionRepository;

    @Autowired
    public LanguageService(LanguageRepository languageRepository, VersionRepository versionRepository){
        this.languageRepository = languageRepository;
        this.versionRepository = versionRepository;
    }


    /**
     * This Method will attempt to create a new Language and attach a version to it.
     * @param language a String, which will be the name of newly created language
     * @param version a String, which will be the version of the newly created version
     */
    public boolean addNewLanguage(String language, int version){
        Language languageFound = this.languageRepository.findByLanguage(language);
        if(languageFound == null){
            this.languageRepository.save(new Language(language));
            return true;
     //      if(version.getVersion() == 0){
     //          this.versionRepository.save(version);
     //      }
     //      else{
                // Get latest

        }
            return false;
    }

    public List<Language> findAllLanguages(){
        return this.languageRepository.findAll();
    }
}
