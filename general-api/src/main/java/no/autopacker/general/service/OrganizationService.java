package no.autopacker.general.service;

import no.autopacker.general.entity.organization.*;
import no.autopacker.general.repository.organization.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

    // Repositories
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberApplicationRepository memberApplicationRepository;
    private final OrganizationRepository organizationRepository;
    private final AuthorityRepository authorityRepository;
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;
    private JavaMailSender javaMailSender;

    @Autowired
    public OrganizationService(ProjectApplicationRepository projectApplicationRepository,
                               MemberApplicationRepository memberApplicationRepository,
                               OrganizationRepository organizationRepository,
                               AuthorityRepository authorityRepository,
                               ProjectRepository projectRepository,
                               MemberRepository memberRepository,
                               RoleRepository roleRepository,
                               JavaMailSender javaMailSender) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.memberApplicationRepository = memberApplicationRepository;
        this.organizationRepository = organizationRepository;
        this.authorityRepository = authorityRepository;
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
        this.roleRepository = roleRepository;
        this.javaMailSender = javaMailSender;
    }

    /*------------------------------
    Membership
    ----------------------------*/

    public ResponseEntity requestMembership(Member member, String comment) {
        MemberApplication memberApplication = new MemberApplication(member, comment);
        if (this.memberApplicationRepository.findByMember_Username(member.getUsername()) == null) {
            this.memberRepository.save(member);
            this.memberApplicationRepository.save(memberApplication);
            return new ResponseEntity("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity("Member application is already sent, please wait for email", HttpStatus.BAD_REQUEST);
        }
    }

    /*------------------------------
    Project submission related
    ----------------------------*/

    public ResponseEntity<String> submitProjectToOrganization(
        OrganizationProject organizationProject, String comment) {
        OrganizationProject foundOrganizationProject = this.projectRepository.findByOrganization_NameAndName(
            organizationProject.getOrganization().getName(), organizationProject.getName());
        if (foundOrganizationProject == null) {
            ProjectApplication foundProjectApplication = this.projectApplicationRepository.findByOrganization_NameAndOrganizationProject_IdAndIsAcceptedIsFalse(
                organizationProject.getOrganization().getName(), organizationProject.getId());
            if (foundProjectApplication == null) {
                // Persist project
                this.projectRepository.save(organizationProject);
                // Persist project application
                ProjectApplication projectApplication = new ProjectApplication(organizationProject.getMember(),
                    organizationProject, comment);
                this.projectApplicationRepository.save(projectApplication);
                // TODO Maybe implement email notification? (discuss)
                return new ResponseEntity<>("OK", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Project application for the given project exist", HttpStatus.CONFLICT);
            }
        } else {
            return new ResponseEntity<>("Project with choosen name already exists", HttpStatus.CONFLICT);
        }
    }

    public ResponseEntity<String> updateProjectSubmission(
        OrganizationProject updatedOrganizationProject, String comment, Long projectId) {
        OrganizationProject foundOrganizationProject = this.projectRepository.findByOrganization_NameAndId(
            updatedOrganizationProject.getOrganization().getName(), projectId);
        if (foundOrganizationProject != null) {
            ProjectApplication foundProjectApplication = this.projectApplicationRepository.findByOrganization_NameAndOrganizationProject_IdAndIsAcceptedIsFalse(
                updatedOrganizationProject.getOrganization().getName(), foundOrganizationProject.getId());
            if (foundProjectApplication != null) {
                // Update project values
                foundOrganizationProject.setName(updatedOrganizationProject.getName());
                foundOrganizationProject.setDescription(updatedOrganizationProject.getDescription());
                foundOrganizationProject.setType(updatedOrganizationProject.getType());
                foundOrganizationProject.setTags(updatedOrganizationProject.getTags());
                foundOrganizationProject.setAuthors(updatedOrganizationProject.getAuthors());
                foundOrganizationProject.setLinks(updatedOrganizationProject.getLinks());
                this.projectRepository.save(foundOrganizationProject);

                // Update project application
                foundProjectApplication.setComment(comment);
                this.projectApplicationRepository.save(foundProjectApplication);

                return new ResponseEntity<>("OK", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Couldn't find a project application for the given project", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Project doesn't exist?", HttpStatus.BAD_REQUEST);
        }
    }

    /*------------------------------
    Member application related
    ----------------------------*/

    public ResponseEntity<String> acceptMemberRequest(String organizationName, String username) {
        MemberApplication memberApplication = this.memberApplicationRepository.findByMember_Username(username);
        if (memberApplication != null) {
            if (memberApplication.getOrganization().getName().equals(organizationName)) {
                if (!memberApplication.isAccepted()) {
                    // Build the email
                    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                    simpleMailMessage.setFrom("AutoPacker");
                    simpleMailMessage.setSubject("Organization membership accepted");
                    simpleMailMessage.setTo(memberApplication.getMember().getEmail());

                    // Build message
                    String stringBuilder =
                            "Hi "
                                    + memberApplication.getMember().getUsername()
                                    + ",\n\n"
                                    + "The purpose of this email is to inform you that you have been accepted as a "
                                    + memberApplication.getMember().getRole().getName()
                                    + " in "
                                    + memberApplication.getOrganization().getName() + "."
                                    + "\n\nBest Regards,\n\nThe AutoPacker Team";
                    simpleMailMessage.setText(stringBuilder);

                    // Send the email
                    this.javaMailSender.send(simpleMailMessage);

                    Member member = memberApplication.getMember();
                    // Update state
                    member.setEnabled(true);
                    this.memberRepository.save(member);
                    memberApplication.setAccepted(true);
                    this.memberApplicationRepository.save(memberApplication);

                    return new ResponseEntity<>("Membership accepted", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("Member application is already accepted", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Organization application doesn't match?!", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Member application doesn't exist?", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<String> declineMemberRequest(String organizationName, String username, String comment) {
        MemberApplication memberApplication = this.memberApplicationRepository.findByMember_Username(username);
        if (memberApplication != null) {
            if (memberApplication.getOrganization().getName().equals(organizationName)) {
                if (!memberApplication.isAccepted()) {
                    // Build the email
                    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                    simpleMailMessage.setFrom("AutoPacker");
                    simpleMailMessage.setSubject("Organization membership declined");
                    simpleMailMessage.setTo(memberApplication.getMember().getEmail());

                    // Build message
                    String stringBuilder =
                            "Hi "
                                    + memberApplication.getMember().getUsername()
                                    + ",\n\n"
                                    + "The purpose of this email is to inform you that your request to become a "
                                    + memberApplication.getMember().getRole().getName()
                                    + " in "
                                    + memberApplication.getOrganization().getName()
                                    + " has been declined."
                                    + "\n\nComment: " + comment
                                    + "\n\nBest Regards,\n\nThe AutoPacker Team";
                    simpleMailMessage.setText(stringBuilder);

                    this.memberApplicationRepository.deleteById(memberApplication.getId());

                    // Send the email
                    this.javaMailSender.send(simpleMailMessage);
                    return new ResponseEntity<>("Membership declined", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("Member application is already accepted", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Organization application doesn't match?!", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Member application doesn't exist?", HttpStatus.BAD_REQUEST);
        }
    }

    /*------------------------------
    Project Request related
    ----------------------------*/

    public ResponseEntity<String> acceptProjectRequest(Long projectRequestId, String comment) {
        ProjectApplication projectApplication = this.projectApplicationRepository.getOne(projectRequestId);
        if (projectApplication != null) {
                if (!projectApplication.isAccepted()) {
                    // Build the email
                    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                    simpleMailMessage.setFrom("AutoPacker");
                    simpleMailMessage.setSubject("Organization project request accepted");
                    simpleMailMessage.setTo(projectApplication.getMember().getEmail());

                    // Build message
                    String stringBuilder =
                            "Hi "
                                    + projectApplication.getMember().getUsername()
                                    + ",\n\n"
                                    + "The purpose of this email is to inform you that your project request for the project: "
                                    + projectApplication.getOrganizationProject().getName()
                                    + " has been accepted to the organization: "
                                    + projectApplication.getOrganization().getName()
                                    + "\n\nComment: " + comment
                                    + "\n\nBest Regards,\n\nThe AutoPacker Team";
                    simpleMailMessage.setText(stringBuilder);

                    // Send the email
                    this.javaMailSender.send(simpleMailMessage);

                    // Update state
                    projectApplication.getOrganizationProject().setAccepted(true);
                    projectApplication.setAccepted(true);
                    this.projectApplicationRepository.save(projectApplication);

                    return new ResponseEntity<>("Project request accepted", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("Project request is already accepted", HttpStatus.BAD_REQUEST);
                }
        } else {
            return new ResponseEntity<>("Project request doesn't exist?", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<String> declineProjectRequest(String organizationName, Long projectRequestId, String comment) {
        ProjectApplication projectApplication = this.projectApplicationRepository.getOne(projectRequestId);
        if (projectApplication != null) {
            if (projectApplication.getOrganization().getName().equals(organizationName)) {
                if (!projectApplication.isAccepted()) {
                    // Build the email
                    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                    simpleMailMessage.setFrom("AutoPacker");
                    simpleMailMessage.setSubject("Organization project request declined");
                    simpleMailMessage.setTo(projectApplication.getMember().getEmail());

                    // Build message
                    String stringBuilder =
                            "Hi "
                                    + projectApplication.getMember().getUsername()
                                    + ",\n\n"
                                    + "The purpose of this email is to inform you that your project request for the project " + projectApplication.getOrganizationProject().getName()
                                    + " To the organization " + projectApplication.getOrganization().getName()
                                    + " has been declined."
                                    + "\n\nComment: " + comment
                                    + "\n\nBest Regards,\n\nThe AutoPacker Team";
                    simpleMailMessage.setText(stringBuilder);

                    this.projectApplicationRepository.deleteById(projectApplication.getId());
                    this.projectRepository.deleteById(projectApplication.getOrganizationProject().getId());

                    // Send the email
                    this.javaMailSender.send(simpleMailMessage);
                    return new ResponseEntity<>("Project request declined", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("Project request is already accepted", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("The given organization doesn't match the project request organization", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Project request doesn't exist?", HttpStatus.BAD_REQUEST);
        }
    }



    public ResponseEntity<String> createNewOrg(Organization organization, String username, String email) {
        Organization orgFound = this.organizationRepository.findByName(organization.getName());
        if (orgFound == null){
          //  if(username != null){
                this.organizationRepository.save(organization);
              /*  Role admin = new Role("ADMIN");
                Member user = new Member(organization, admin, username, username, email);
                user.setEnabled(true);
                this.memberRepository.save(user); */
                return ResponseEntity.ok().build();
           // } else{
             //   return new ResponseEntity<>("Please log in on a verified user!", HttpStatus.BAD_REQUEST);
           // }
        } else {
            return new ResponseEntity<>("Organization already existing!", HttpStatus.BAD_REQUEST);
        }

    }
}
