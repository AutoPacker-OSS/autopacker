package no.autopacker.api.init;

import no.autopacker.api.entity.User;
import no.autopacker.api.entity.fdapi.Project;
import no.autopacker.api.entity.organization.*;
import no.autopacker.api.repository.UserRepository;
import no.autopacker.api.repository.fdapi.ProjectRepository;
import no.autopacker.api.repository.organization.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.util.Arrays;

import static no.autopacker.api.security.AuthConstants.ROLE_MEMBER;

/**
 * This class is only meant for manual testing and displaying dummy data
 */
@Service
@Order(value = 3)
public class OrganizationDBInit implements CommandLineRunner {

    // Organization Repositories
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberApplicationRepository memberApplicationRepository;
    private final OrganizationRepository organizationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrganizationDBInit(ProjectApplicationRepository projectApplicationRepository,
                              MemberApplicationRepository memberApplicationRepository,
                              OrganizationRepository organizationRepository,
                              ProjectRepository projectRepository,
                              UserRepository userRepository) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.memberApplicationRepository = memberApplicationRepository;
        this.organizationRepository = organizationRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        /*------------------------------
        Organization
        ----------------------------*/

        // Clear all repositories for data
        // TODO - don't clean all the data every time - make conditional inserts!
        this.projectApplicationRepository.deleteAll();
        this.memberApplicationRepository.deleteAll();
        this.projectRepository.deleteAll();
        this.organizationRepository.deleteAll();

        User adminUser = userRepository.findByUsername("user");
        User testUser = userRepository.findByUsername("Tionve");

        // Create organization
        Organization ntnu = new Organization(
                "NTNU",
                "Norwegian University of Science and Technology (NTNU) is a state university in Norway, and from 2016 the country's largest. It has headquarters in Trondheim and campuses in Gjøvik and Ålesund.", "https://www.ntnu.no/",
                true,
                adminUser);
        this.organizationRepository.save(ntnu);
        Organization testOrg = new Organization(
                "Another Test organization",
                "This is a test organization",
                "https://example.com/",
                true,
                testUser);
        this.organizationRepository.save(testOrg);

        User arro = userRepository.findByUsername("Arro1990");
        ntnu.addAdminMember(userRepository.findByUsername("vister"));
        ntnu.addAdminMember(arro);
        ntnu.addMember(userRepository.findByUsername("Tionve"));
        ntnu.addMember(userRepository.findByUsername("Boodsom"));
        ntnu.addMember(userRepository.findByUsername("Jone1994"));
        ntnu.addMember(userRepository.findByUsername("Funt1959"));
        ntnu.addMember(userRepository.findByUsername("Sithered"));
        ntnu.addAdminMember(adminUser);
        organizationRepository.save(ntnu);
        testOrg.addAdminMember(userRepository.findByUsername("user2"));
        User hatiou = userRepository.findByUsername("Hatiou1983");
        testOrg.addMember(hatiou);
        User chu = userRepository.findByUsername("chu3Il2ahkai");
        testOrg.addMember(chu);
        organizationRepository.save(testOrg);

        // Create project
        Project ntnuPrivateProj = new Project("NTNUPrivate", arro, "https://ntnu.no/projectOne", true);
        ntnuPrivateProj.setDescription("A private NTNU project");
        ntnuPrivateProj.setOrganization(ntnu);
        Project ntnuPublicProj = new Project("NTNUPublic", adminUser, "https://ntnu.no/projectSecret", false);
        ntnuPublicProj.setDescription("A public NTNU projec");
        ntnuPublicProj.setWebsite("http://localhost:3000");
        ntnuPublicProj.setTags("test,tag,something");
        ntnuPublicProj.setOrganization(ntnu);

        Project testProjPublic = new Project("TestPublicProj", adminUser, "http://myproject.no", false);
        testProjPublic.setDescription("A public project SUBMITTED for Test organization");
        Project testProjPrivate = new Project("TestPrivateProj", adminUser, "https://myproject.no?secret=42", true);
        testProjPrivate.setDescription("A private project SUBMITTED for Test organization");
        this.projectRepository.saveAll(Arrays.asList(ntnuPublicProj, ntnuPrivateProj, testProjPrivate, testProjPublic));

        // Create project application
        this.projectApplicationRepository.save(new ProjectApplication(testProjPublic, ntnu, "Bachelor project"));
        this.projectApplicationRepository.save(new ProjectApplication(testProjPrivate, ntnu, "Test project"));

        // Create member application
        this.memberApplicationRepository.save(new MemberApplication(hatiou, ntnu, ROLE_MEMBER, "Please accept me :D"));
        this.memberApplicationRepository.save(new MemberApplication(chu, ntnu, ROLE_MEMBER, "Nice feature there"));
    }
}
