package no.autopacker.api.dto.mapper;

import no.autopacker.api.dto.MemberListItemDto;
import no.autopacker.api.dto.OrganizationListItemDto;
import no.autopacker.api.dto.UserDto;
import no.autopacker.api.entity.User;
import no.autopacker.api.entity.organization.Member;
import no.autopacker.api.entity.organization.Organization;

import java.util.ArrayList;
import java.util.List;

public class MemberMapper {
    public MemberListItemDto convertToMemberListItemDto(Member member) {
        return new MemberListItemDto(member.getId(), member.getUser().getUsername(), member.getRole());
    }

    public List<MemberListItemDto> toMemberListItemsDtos(List<Member> members) {
        List<MemberListItemDto> memberListItemDtos = new ArrayList<>();
        for (Member member : members) {
            memberListItemDtos.add(convertToMemberListItemDto(member));
        }
        return memberListItemDtos;
    }
}
