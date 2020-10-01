package no.autopacker.general.repository.tools;


import no.autopacker.general.entity.tools.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

    Language findByLanguage(String language);

    List<Language> findAll();

}
