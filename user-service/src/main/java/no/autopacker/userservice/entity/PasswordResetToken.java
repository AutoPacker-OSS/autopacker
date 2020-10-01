package no.autopacker.userservice.entity;

import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import no.autopacker.userservice.domain.Token;

/**
 * Represents a PasswordResetToken entity which is created when users forget their password. This token is unique
 * for every user and will be sent with a password reset mail
 */
@Entity
@NoArgsConstructor
public class PasswordResetToken extends Token {
    public PasswordResetToken(User user, String tokenVal) {
        super(user, tokenVal);
    }
}
