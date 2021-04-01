package no.autopacker.api.init;

import no.autopacker.api.entity.User;
import no.autopacker.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

@Service
@Order(value = 4)
public class DefaultUserImport implements CommandLineRunner {
    private UserRepository userRepository;

    @Autowired
    public DefaultUserImport(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Add the default users to the database. This will be executed automatically when the backend is started
     * @param args
     * @throws Exception
     */
    @Override
    public void run(String... args) throws Exception {
        addUserIfNotExists("user");
        addUserIfNotExists("admin");
    }

    private void addUserIfNotExists(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("Adding default user " + username);
            String fakeEmail = username + "@" + username + ".com";
            user = new User(username, fakeEmail);
            user.setId(username + ".fake");
            userRepository.save(user);
        } else {
            System.out.println("Tried to add user " + username + ", but it existed already, skipping...");
        }
    }
}
