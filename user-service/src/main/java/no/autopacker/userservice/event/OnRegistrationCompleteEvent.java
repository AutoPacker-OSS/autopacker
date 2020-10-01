package no.autopacker.userservice.event;

import no.autopacker.userservice.entity.User;
import org.springframework.context.ApplicationEvent;

import java.util.Locale;

/**
 * The event our RESTController is sending out after registration. This class is taken from:
 * https://www.baeldung.com/registration-verify-user-by-email
 */
public class OnRegistrationCompleteEvent extends ApplicationEvent {

    private String appUrl;
    private Locale locale;
    private User user;

    public OnRegistrationCompleteEvent(String appUrl, Locale locale, User user) {
        super(user);
        this.appUrl = appUrl;
        this.locale = locale;
        this.user = user;
    }

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }

    public Locale getLocale() {
        return locale;
    }

    public void setLocale(Locale locale) {
        this.locale = locale;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
