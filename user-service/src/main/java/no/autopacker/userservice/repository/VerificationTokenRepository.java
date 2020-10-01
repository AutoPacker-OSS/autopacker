package no.autopacker.userservice.repository;

import no.autopacker.userservice.entity.User;
import no.autopacker.userservice.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

/** Interface for communicating with database regarding VerificationToken specific tasks */
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByTokenVal(String tokenVal);

    VerificationToken findByUser(User user);
}
