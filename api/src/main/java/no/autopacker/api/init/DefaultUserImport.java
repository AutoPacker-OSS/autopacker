package no.autopacker.api.init;

import no.autopacker.api.entity.User;
import no.autopacker.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import static no.autopacker.api.security.AuthConstants.ROLE_ADMIN;
import static no.autopacker.api.security.AuthConstants.ROLE_MEMBER;

@Service
@Order(value = 2)
public class DefaultUserImport implements CommandLineRunner {
    private final UserRepository userRepository;

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
        addUserIfNotExists("user", ROLE_ADMIN, "Admin user", "autopacker01@gmail.com");
        addUserIfNotExists("test", ROLE_ADMIN, "Test user", "test@example.no");
        addUserIfNotExists("vister", ROLE_MEMBER, "Victor F. Charlsson", "vister@dummy.no");
        addUserIfNotExists("Arro1990", ROLE_MEMBER, "Bethany B. Mowry", "BethanyBMowry@teleworm.us");
        addUserIfNotExists("Tionve", ROLE_MEMBER, "Sidney M. Norberg", "SidneyMNorberg@armyspy.com");
        addUserIfNotExists("Boodsom", ROLE_MEMBER, "Keram Chichigov", "KeramChichigov@jourrapide.com");
        addUserIfNotExists("Jone1994", ROLE_MEMBER, "Esila Umkhayev", "EsilaUmkhayev@dayrep.com");
        addUserIfNotExists("Funt1959", ROLE_MEMBER, "Mollie Heath", "MollieHeath@jourrapide.com");
        addUserIfNotExists("Sithered", ROLE_MEMBER, "Summer Sims", "SummerSims@rhyta.com");
        addUserIfNotExists("user2", ROLE_MEMBER, "user2", "SummerSims@rhyta.com");
        addUserIfNotExists("Hatiou1983", ROLE_MEMBER, "Billy B. Kincaid", "JosephCAnderson@rhyta.com");
        addUserIfNotExists("chu3Il2ahkai", ROLE_MEMBER, "Joseph C. Anderson", "JosephCAnderson2@rhyta.com");
    }

    /**
     * Add a user to database, if it does not exist already
     * @param username Username for the user
     * @param roleName name of the system-wide role
     */
    private void addUserIfNotExists(String username, String roleName, String name, String email) throws Exception {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("Adding default user " + username);
            user = new User(username, email);
            user.setName(name);
            user.setSystemRole(roleName);
            userRepository.save(user);
        }
    }
}
