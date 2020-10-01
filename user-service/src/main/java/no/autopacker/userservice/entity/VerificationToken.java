package no.autopacker.userservice.entity;

import lombok.NoArgsConstructor;

import javax.persistence.*;
import no.autopacker.userservice.domain.Token;

/**
 * Represents a VerificationToken entity which is created after registration. This token is unique
 * for every user and will be sent with a verification mail
 */
@Entity
@NoArgsConstructor
public class VerificationToken extends Token {
    public VerificationToken(User user, String tokenVal) {
        super(user, tokenVal);
    }
}
