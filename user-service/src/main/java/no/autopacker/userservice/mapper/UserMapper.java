package no.autopacker.userservice.mapper;

import java.util.ArrayList;
import java.util.List;
import lombok.NoArgsConstructor;
import no.autopacker.userservice.dto.UserDto;
import no.autopacker.userservice.entity.User;
import org.springframework.context.annotation.Configuration;

/**
 * TODO Discuss if this is necessary and pros and cons of using a converter, etc etc..
 */
@Configuration
@NoArgsConstructor
public class UserMapper {

    public UserDto convertToUserDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    public List<UserDto> convertToListOfUserDtos(List<User> users) {
        ArrayList<UserDto> dtoArrayList = new ArrayList<>();
        for (User user : users) {
            dtoArrayList.add(convertToUserDto(user));
        }
        return dtoArrayList;
    }

}
