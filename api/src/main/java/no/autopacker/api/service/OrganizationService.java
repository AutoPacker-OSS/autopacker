package no.autopacker.api.service;

import no.autopacker.api.entity.User;
import no.autopacker.api.entity.fdapi.Project;
import no.autopacker.api.entity.organization.*;
import no.autopacker.api.repository.UserRepository;
import no.autopacker.api.repository.fdapi.ProjectRepository;
import no.autopacker.api.repository.organization.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrganizationService {

    // Repositories
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberApplicationRepository memberApplicationRepository;
    private final OrganizationRepository organizationRepository;
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;

    @Autowired
    public OrganizationService(ProjectApplicationRepository projectApplicationRepository,
                               MemberApplicationRepository memberApplicationRepository,
                               OrganizationRepository organizationRepository,
                               ProjectRepository projectRepository,
                               MemberRepository memberRepository,
                               UserRepository userRepository,
                               JavaMailSender javaMailSender) {
        this.projectApplicationRepository = projectApplicationRepository;
        this.memberApplicationRepository = memberApplicationRepository;
        this.organizationRepository = organizationRepository;
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.javaMailSender = javaMailSender;
    }

    /*------------------------------
    Membership
    ----------------------------*/

    public ResponseEntity<String> requestMembership(String username, String organizationName, String role, String comment) {
        Organization organization = organizationRepository.findByName(organizationName);
        if (organization == null) {
            return new ResponseEntity<>("Wrong organization", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return new ResponseEntity<>("Wrong user", HttpStatus.BAD_REQUEST);
        }
        if (this.memberApplicationRepository.findByOrganizationAndUser(organization, user) == null) {
            memberApplicationRepository.save(new MemberApplication(user, organization, role, comment));
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Member application is already sent, please wait for email", HttpStatus.BAD_REQUEST);
        }
    }

    /*------------------------------
    Project submission related
    ----------------------------*/

    public ResponseEntity<String> submitProjectToOrganization(String organizationName, Long projectId, String comment) {
        Optional<Project> proj = projectRepository.findById(projectId);
        if (proj.isPresent()) {
            Organization organization = organizationRepository.findByName(organizationName);
            if (organization != null) {
                Project project = proj.get();
                ProjectApplication application = projectApplicationRepository.findForProjAndOrg(organizationName, projectId);
                if (application == null) {
                    // Persist project application
                    ProjectApplication projectApplication = new ProjectApplication(project, organization, comment);
                    this.projectApplicationRepository.save(projectApplication);
                    // TODO Maybe implement email notification? (discuss)
                    return new ResponseEntity<>("OK", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Project application for the given project exist", HttpStatus.CONFLICT);
                }
            } else {
                return new ResponseEntity<>("Organization not found", HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>("Project not found", HttpStatus.NOT_FOUND);
        }
    }

    /*------------------------------
    Member application related
    ----------------------------*/

    public ResponseEntity<String> acceptOrDeclineMemberRequest(Organization organization, String username, boolean accept) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return new ResponseEntity<>("Member application doesn't exist?", HttpStatus.BAD_REQUEST);
        }
        MemberApplication memberApplication = memberApplicationRepository.findByOrganizationAndUser(organization, user);
        if (memberApplication != null) {
            if (!memberApplication.isAccepted()) {
                String emailText = getMemberApplicationResponseText(username, memberApplication.getRole(), organization.getName(), accept);
                String decision = accept ? "accepted" : "declined";
                sendEmail("Organization membership " + decision, user.getEmail(), emailText);

                if (accept) {
                    organization.addMemberWithRole(user, memberApplication.getRole());
                    organizationRepository.save(organization);
                    memberApplication.setAccepted(true);
                    this.memberApplicationRepository.save(memberApplication);
                } else {
                    this.memberApplicationRepository.deleteById(memberApplication.getId());
                }

                return new ResponseEntity<>("Membership " + decision, HttpStatus.OK);

            } else {
                return new ResponseEntity<>("Member application is already accepted", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("Member application doesn't exist?", HttpStatus.BAD_REQUEST);
        }
    }

    private void sendEmail(String subject, String recipientEmail, String text) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom("AutoPacker");
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setTo(recipientEmail);
        simpleMailMessage.setText(text);
        this.javaMailSender.send(simpleMailMessage);
    }

    /**
     * Get a text to send in confirmation email to the user who applied for membership
     *
     * @param username         Username for the recipient user
     * @param role             Role or which the user applied
     * @param organizationName Name of the organization
     * @param accept           When true, return "Congrats, accepted" text. Otherwise return "Sorry, declined" text
     * @return The text that can be send in an email
     */
    private String getMemberApplicationResponseText(String username, String role, String organizationName, boolean accept) {
        String decision = accept ? "accepted" : "declined";
        String stringBuilder = "Hi " + username
                + ",\n\n"
                + "The purpose of this email is to inform you that your application to become "
                + role
                + " in "
                + organizationName + "has been " + decision + "."
                + "\n\nBest Regards,\n\nThe AutoPacker Team";
        return stringBuilder.toString();
    }

    /*------------------------------
    Project Request related
    ----------------------------*/

    public ResponseEntity<String> acceptOrDeclineProjectRequest(Long projectRequestId, User user,
                                                                Organization organization,
                                                                String comment, boolean accept) {
        Optional<ProjectApplication> pa = this.projectApplicationRepository.findById(projectRequestId);
        if (pa.isEmpty()) {
            return new ResponseEntity<>("Project request doesn't exist", HttpStatus.BAD_REQUEST);
        }
        ProjectApplication projectApplication = pa.get();
        if (projectApplication.isAccepted()) {
            return new ResponseEntity<>("Project request is already accepted", HttpStatus.BAD_REQUEST);
        }

        Project project = projectApplication.getProject();

        if (accept) {
            // Update state
            projectApplication.setAccepted(true);
            projectApplicationRepository.save(projectApplication);
            project.setOrganization(organization);
            project.setOwner(organization.getOwner());
            projectRepository.save(project);
        } else {
            projectApplicationRepository.delete(projectApplication);
        }

        String decision = accept ? "accepted" : "declined";
        String emailText = getProjectApplicationResponseText(user.getUsername(), project.getName(),
                organization.getName(), comment, accept);
        sendEmail("Organization project request " + decision, user.getEmail(), emailText);

        return new ResponseEntity<>("Project request " + decision, HttpStatus.OK);
    }

    /**
     * Get a text to send in confirmation email when project application is accepted or declined.
     *
     * @param projectName      Name of the submitted project
     * @param username         Username for the recipient user
     * @param organizationName Name of the organization
     * @param comment          Comment from the Organization admin
     * @param accept           When true, return "Congrats, accepted" text. Otherwise return "Sorry, declined" text
     * @return The text that can be send in an email
     */
    private String getProjectApplicationResponseText(String username, String projectName, String organizationName,
                                                     String comment, boolean accept) {
        // Build message
        String stringBuilder = "Hi "
                + username
                + ",\n\n"
                + "The purpose of this email is to inform you that your project request for the project: "
                + projectName
                + " has been accepted to the organization: "
                + organizationName
                + "\n\nComment: " + comment
                + "\n\nBest Regards,\n\nThe AutoPacker Team";
        return stringBuilder.toString();
    }

    public ResponseEntity<String> createNewOrg(String name, String description, String ownerUsername, String url,
                                               boolean isPublic) {
        User owner = userRepository.findByUsername(ownerUsername);
        if (owner == null) {
            return new ResponseEntity<>("Incorrect owner username!", HttpStatus.BAD_REQUEST);
        }
        Organization organization = organizationRepository.findByName(name);
        if (organization == null) {
            organization = new Organization(name, description, url, isPublic, owner);
            organizationRepository.save(organization);
            return new ResponseEntity<>("Organization Created", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Organization already existing!", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<String> changeRole(Organization organization, String username, String role) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            Member member = this.memberRepository.findByOrganization_IdAndUser_Username(organization.getId(), username);
            member.setRole(role);
            this.memberRepository.save(member);
            return new ResponseEntity<>("Role Changed!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Organization do not exist!", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<String> deleteMember(Organization organization, String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            if (organization.removeMember(user)) {
                organizationRepository.save(organization);
                return new ResponseEntity<>("User Deleted", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User was not a member of the organization!", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>("User does not exist!", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Check if the specified user is a member of the specified organization
     *
     * @param user
     * @param organization
     * @return True if the user is a member of the organization, false otherwise
     */
    public boolean isOrgMemberOf(User user, Organization organization) {
        if (user == null || organization == null) return false;
        return user.isMemberOf(organization);
    }
}
