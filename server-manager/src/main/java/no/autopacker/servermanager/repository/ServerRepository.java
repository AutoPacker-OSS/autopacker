package no.autopacker.servermanager.repository;

import no.autopacker.servermanager.entity.Server;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Interface for communicating with database regarding server specific tasks */
public interface ServerRepository extends JpaRepository<Server, Long> {

    Server findByServerId(Long id);

    Server findByTitleAndOwnerIgnoreCase(String title, String owner);

    List<Server> findAllByOwner(String owner);

    List<Server> findAllByTitleContainingAndAndOwner(String title, String owner);

}
