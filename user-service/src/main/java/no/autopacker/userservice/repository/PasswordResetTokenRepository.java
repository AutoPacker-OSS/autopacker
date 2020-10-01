package no.autopacker.userservice.repository;

import no.autopacker.userservice.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

/** Interface for communicating with database regarding PasswordResetToken specific tasks */
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByTokenVal(String tokenVal);
}
