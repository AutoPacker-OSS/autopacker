package no.autopacker.userservice.validator;


import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import no.autopacker.userservice.annotation.ValidEmail;

/**
 * This class contains the logic for our custom email validator. We use this instead as the default
 * @Email validation is outdated. This class is inspired from: https://www.baeldung.com/registration-with-spring-mvc-and-spring-security
 */
public class EmailValidator implements ConstraintValidator<ValidEmail, String> {

    private static final String VALID_PATTERN =
        "^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$";

    @Override
    public void initialize(ValidEmail constraintAnnotation) {
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return validateEmail(email);
    }

    /**
     * Returns <code>true</code> if email meets the set requirements and <code>false</code> if not
     *
     * @param email email to validate
     * @return <code>true</code> if email meets the set requirements and <code>false</code> if not
     */
    private boolean validateEmail(String email) {
        Pattern pattern = Pattern.compile(VALID_PATTERN);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
