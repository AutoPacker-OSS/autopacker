package no.autopacker.general.init;

import no.autopacker.general.entity.organization.*;
import no.autopacker.general.entity.tools.Language;
import no.autopacker.general.entity.tools.Version;
import no.autopacker.general.repository.organization.*;
import no.autopacker.general.repository.tools.LanguageRepository;
import no.autopacker.general.repository.tools.VersionRepository;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * This class is only meant for manual testing and displaying dummy data
 */
@Service
public class DBInit implements CommandLineRunner {

    // Organization Repositories
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberApplicationRepository memberApplicationRepository;
    private final OrganizationRepository organizationRepository;
    private final AuthorityRepository authorityRepository;
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;

    // Language Repositories
    private LanguageRepository languageRepository;
    private VersionRepository versionRepository;

    @Autowired
    public DBInit(ProjectApplicationRepository projectApplicationRepository,
                  MemberApplicationRepository memberApplicationRepository,
                  OrganizationRepository organizationRepository,
                  AuthorityRepository authorityRepository,
                  ProjectRepository projectRepository,
                  MemberRepository memberRepository,
                  RoleRepository roleRepository,
                  LanguageRepository languageRepository,
                  VersionRepository versionRepository) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.memberApplicationRepository = memberApplicationRepository;
        this.organizationRepository = organizationRepository;
        this.authorityRepository = authorityRepository;
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
        this.roleRepository = roleRepository;
        this.languageRepository = languageRepository;
        this.versionRepository = versionRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        /*------------------------------
        Language
        ----------------------------*/

        this.versionRepository.deleteAll();

        this.languageRepository.deleteAll();

        Language java = new Language("Java");

        Language python = new Language("Python");
        Version firstGen = new Version(11, java);
        Version secondGen = new Version(13, java);
        Version thirdGen = new Version(30, python);

        List<Language> languages = Arrays.asList(java, python);

        this.languageRepository.saveAll(languages);

        List<Version> versions = Arrays.asList(firstGen, secondGen, thirdGen);
        this.versionRepository.saveAll(versions);

        /*------------------------------
        Organization
        ----------------------------*/

        // Clear all repositories for data
        this.projectApplicationRepository.deleteAll();
        this.memberApplicationRepository.deleteAll();
        this.projectRepository.deleteAll();
        this.authorityRepository.deleteAll();
        this.memberRepository.deleteAll();
        this.roleRepository.deleteAll();
        this.organizationRepository.deleteAll();

        // Create roles
        Role admin = new Role("ADMIN");
        Role student = new Role("STUDENT");
        Role employee = new Role("EMPLOYEE");
        Role maintainer = new Role("MAINTAINER");
        Role owner = new Role("OWNER");
        Role member = new Role("MEMBER");
        this.roleRepository.saveAll(Arrays.asList(admin, maintainer, student, employee, member, owner));

        // Create organization
        Organization ntnu = new Organization("NTNU", "Norwegian University of Science and Technology (NTNU) is a state university in Norway, and from 2016 the country's largest. It has headquarters in Trondheim and campuses in Gjøvik and Ålesund.", "https://www.ntnu.no/", true);
        this.organizationRepository.save(ntnu);
        Organization testing = new Organization("testing", "Norwegian University of Science and Technology (NTNU) is a state university in Norway, and from 2016 the country's largest. It has headquarters in Trondheim and campuses in Gjøvik and Ålesund.", "https://www.ntnu.no/", true);
        this.organizationRepository.save(testing);

        // Create members
        Member user = new Member(ntnu, admin, "user", "User", "autopacker01@gmail.com");
        user.setEnabled(true);
        Member vister = new Member(ntnu, admin, "vister", "Victor F. Charlsson", "vister@dummy.no");
        vister.setEnabled(true);
        Member Arro1990 = new Member(ntnu, admin, "Arro1990", "Bethany B. Mowry", "BethanyBMowry@teleworm.us");
        Arro1990.setEnabled(true);
        Member Tionve = new Member(ntnu, maintainer, "Tionve", "Sidney M. Norberg", "SidneyMNorberg@armyspy.com");
        Tionve.setEnabled(true);
        Member Boodsom = new Member(ntnu, employee, "Boodsom", "Keram Chichigov", "KeramChichigov@jourrapide.com");
        Boodsom.setEnabled(true);
        Member Jone1994 = new Member(ntnu, employee, "Jone1994", "Esila Umkhayev", "EsilaUmkhayev@dayrep.com");
        Jone1994.setEnabled(true);
        Member Funt1959 = new Member(ntnu, student, "Funt1959", "Mollie Heath", "MollieHeath@jourrapide.com");
        Funt1959.setEnabled(true);
        Member Sithered = new Member(ntnu, student, "Sithered", "Summer Sims", "SummerSims@rhyta.com");
        Sithered.setEnabled(true);
        Member user2 = new Member(ntnu, member, "user2", "user2", "SummerSims@rhyta.com");
        user2.setEnabled(true);
        Member user22 = new Member(testing, member, "user2", "user2", "SummerSims@rhyta.com");
        user22.setEnabled(true);

        Member Hatiou1983 = new Member(ntnu, student, "Hatiou1983", "Billy B. Kincaid", "JosephCAnderson@rhyta.com");
        Member chu3Il2ahkai = new Member(ntnu, student, "chu3Il2ahkai", "Joseph C. Anderson", "JosephCAnderson@rhyta.com");
        this.memberRepository.saveAll(Arrays.asList(user, vister, Arro1990, Tionve, Hatiou1983, chu3Il2ahkai, Boodsom, Jone1994, Funt1959, Sithered, user2, user22));

        // Create project
        OrganizationProject test = new OrganizationProject(ntnu, Arro1990, new JSONArray(Arrays.asList("Bethany")), 1L, "Test Project", "Bachelor", "This is just for displaying data from db", new JSONArray(Arrays.asList("http://localhost")), new JSONArray(Arrays.asList("test", "project")));
        test.setAccepted(true);
        // Project for project requesting
        OrganizationProject project = new OrganizationProject(ntnu, Arro1990, new JSONArray(Arrays.asList("Bethany")), 2L, "My Project", "Personal", "Just a simple test project", new JSONArray(Arrays.asList("http://localhost", "http://myproject.no")), new JSONArray(Arrays.asList("My", "project")));
        OrganizationProject project1 = new OrganizationProject(ntnu, Tionve, new JSONArray(Arrays.asList("Sidney", "Dingles")), 9L, "Test2 Project", "Personal", "Just a simple test project", new JSONArray(Arrays.asList("http://localhost", "http://myproject.no")), new JSONArray(Arrays.asList("test", "project")));
        this.projectRepository.saveAll(Arrays.asList(test, project, project1));

        // Create project application
        this.projectApplicationRepository.save(new ProjectApplication(
            Arro1990, project, "Bachelor project"
        ));
        this.projectApplicationRepository.save(new ProjectApplication(
            Tionve, project1, "Test project"
        ));

        // Create member application
        this.memberApplicationRepository.save(new MemberApplication(
            Hatiou1983, "Please accept me :D"
        ));
        this.memberApplicationRepository.save(new MemberApplication(
            chu3Il2ahkai, "Nice feature there"
        ));

    }
}
