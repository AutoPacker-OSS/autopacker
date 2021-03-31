package no.autopacker.api.annotation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;
import no.autopacker.api.validator.EmailValidator;

/**
 * This is our custom email validation annotation. This creates a validation annotation that we can
 * add to the user entity field which then is validated when persisting the entity
 *
 * <p>This code is taken from this guide:
 * https://www.baeldung.com/registration-with-spring-mvc-and-spring-security
 */
@Target({PARAMETER, FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = EmailValidator.class)
@Documented
public @interface ValidEmail {

    String message() default "Invalid email";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
