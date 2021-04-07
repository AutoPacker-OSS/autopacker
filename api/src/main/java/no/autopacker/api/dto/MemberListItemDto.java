package no.autopacker.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import no.autopacker.api.entity.organization.OrgMemberKey;

@Data
@AllArgsConstructor
public class MemberListItemDto {
    private OrgMemberKey id;
    private String username;
    private String role;
}
