package no.autopacker.api.init;

import no.autopacker.api.entity.User;
import no.autopacker.api.entity.organization.Role;
import no.autopacker.api.repository.UserRepository;
import no.autopacker.api.repository.organization.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import static no.autopacker.api.security.AuthConstants.ROLE_ADMIN;
import static no.autopacker.api.security.AuthConstants.ROLE_MEMBER;

@Service
@Order(value = 4)
public class DefaultUserImport implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public DefaultUserImport(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    /**
     * Add the default users to the database. This will be executed automatically when the backend is started
     * @param args
     * @throws Exception
     */
    @Override
    public void run(String... args) throws Exception {
        addUserIfNotExists("user", ROLE_MEMBER);
        addUserIfNotExists("admin", ROLE_ADMIN);
    }

    /**
     * Add a user to database, if it does not exist already
     * @param username Username for the user
     * @param roleName name of the system-wide role
     */
    private void addUserIfNotExists(String username, String roleName) throws Exception {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("Adding default user " + username);
            String fakeEmail = username + "@" + username + ".com";
            user = new User(username, fakeEmail);
            user.setId(username + ".fake");
            Role role = roleRepository.findByName(roleName);
            if (role != null) {
                user.setSystemRole(role);
            } else {
                throw new Exception("Can't add user " + username + ", because role " + roleName + " is not found!");
            }
            userRepository.save(user);
        }
    }
}
