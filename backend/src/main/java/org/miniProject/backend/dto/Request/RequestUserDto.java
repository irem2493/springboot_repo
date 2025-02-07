package org.miniProject.backend.dto.Request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RequestUserDto {
    private String username;
    private String password;
    private String name;
    private String birth;
    private String gender;
    private String role;
    private MultipartFile file;
    private String fileGbnCd;
    private String fileRefId;
}
