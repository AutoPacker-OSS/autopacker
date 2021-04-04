package no.autopacker.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrganizationListItemDto {

    private Long id;
    private String name;
    private String description;

}
