package no.autopacker.api.dto.mapper;

import java.util.ArrayList;
import java.util.List;
import lombok.NoArgsConstructor;
import no.autopacker.api.dto.UserDto;
import no.autopacker.api.entity.User;
import org.springframework.context.annotation.Configuration;

@Configuration
@NoArgsConstructor
public class UserMapper {

    public UserDto convertToUserDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    public List<UserDto> toUserDtoList(List<User> users) {
        ArrayList<UserDto> dtoArrayList = new ArrayList<>();
        for (User user : users) {
            dtoArrayList.add(convertToUserDto(user));
        }
        return dtoArrayList;
    }

}
