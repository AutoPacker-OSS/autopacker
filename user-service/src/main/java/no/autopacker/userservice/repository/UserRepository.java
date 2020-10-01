package no.autopacker.userservice.repository;

import no.autopacker.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Interface for communicating with database regarding auth specific tasks */
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    User findByEmail(String email);

    User findByUsernameIgnoreCase(String username);

    User findByEmailIgnoreCase(String email);

    List<User> findAllByUsernameContaining(String search);
}