package org.miniProject.backend.dto.common;

import lombok.Data;

@Data
public class FileDto {
    private Integer fileNo;
    private String fileGubnCode;
    private String fileOldName;
    private String fileNewName;
    private String fileExt;
    private String fileUrl;
    private Long fileSize;
    private String username;
    private String fileRefId;

}
