package org.miniProject.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenUserDto {
    private String username;
    private String name;
    private String role;
    private String fileUrl;
}
