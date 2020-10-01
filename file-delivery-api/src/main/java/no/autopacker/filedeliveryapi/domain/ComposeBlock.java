package no.autopacker.filedeliveryapi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComposeBlock {

    private Long id;
    private String name;
    private String location;

    public ComposeBlock(String name, String location) {
        this.name = name;
        this.location = location;
    }
}
