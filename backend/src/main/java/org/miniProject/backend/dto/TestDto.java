package org.miniProject.backend.dto;

import lombok.Data;

@Data
public class TestDto {
    private int id;
    private String name;

    public TestDto(int id, String name) {
        this.id = id;
        this.name = name;
    }
}
