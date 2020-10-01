package no.autopacker.userservice.event;

import no.autopacker.userservice.config.AppConfig;
import no.autopacker.userservice.entity.User;
import no.autopacker.userservice.userinterface.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Handles the OnRegistrationCompleteEvent and sends the confirmation email when triggered. This
 * class is inspired from: https://www.baeldung.com/registration-verify-user-by-email
 */
@Component
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    private UserService userService;
    private JavaMailSender mailSender;

    @Autowired
    public RegistrationListener(UserService userService, JavaMailSender mailSender, AppConfig appConfig) {
        this.userService = userService;
        this.mailSender = mailSender;
    }

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent onRegistrationCompleteEvent) {
        this.confirmRegistration(onRegistrationCompleteEvent);
    }

    /**
     * Sends a verification email to the given user with the verification token
     *
     * @param event the OnRegistration.. event sent by the RESTController after registration
     */
    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        this.userService.createVerificationToken(user, token);

        // Build confirmation url
        String confirmationUrl = event.getAppUrl() + "/registrationConfirmation?token=" + token;

        String recipientAddress = user.getEmail();
        String subject = "Email Verification - AutoPacker";
        // Create message

        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom("AutoPacker");
        email.setTo(recipientAddress);
        email.setSubject(subject);
        String stringBuilder = "Hi " + user.getUsername() + ",\n\n" +
            "Thank you for joining us! Please click the link below to verify your email address.\n\n" +
            confirmationUrl +
            "\n\nFor a little happy thought, try this link! https://cat-bounce.com/\n\n" +
            "Best Regards,\n\nThe AutoPacker Team";
        email.setText(stringBuilder);
        this.mailSender.send(email);
    }
}
