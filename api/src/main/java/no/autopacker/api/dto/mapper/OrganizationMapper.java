package no.autopacker.api.dto.mapper;

import lombok.NoArgsConstructor;
import no.autopacker.api.dto.OrganizationListItemDto;
import no.autopacker.api.entity.organization.Organization;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@NoArgsConstructor
public class OrganizationMapper {

    public OrganizationListItemDto convertToOrganizationListDto(Organization organization) {
        return new OrganizationListItemDto(organization.getId(), organization.getName(), organization.getDescription());
    }

    public List<OrganizationListItemDto> toOrganizationListItemDtos(List<Organization> organizations) {
        List<OrganizationListItemDto> organizationListItemDtos = new ArrayList<>();
        for (Organization organization : organizations) {
            organizationListItemDtos.add(convertToOrganizationListDto(organization));
        }
        return organizationListItemDtos;
    }

}
