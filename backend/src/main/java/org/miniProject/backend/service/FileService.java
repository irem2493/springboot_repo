package org.miniProject.backend.service;

import lombok.RequiredArgsConstructor;
import org.miniProject.backend.dto.common.FileDto;
import org.miniProject.backend.entity.File;
import org.miniProject.backend.repository.FileRepository;
import org.miniProject.backend.utils.FileUploadsUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final FileUploadsUtils fileUploadsUtils;

    //DTO(Data Transfer Object)와 엔티티(Entity) 간의 변환을 간편하게 해주는 도구
    private final ModelMapper modelMapper;

    @Transactional
    public void saveFile(MultipartFile file,
                            String fileGbnCd,
                            String fileRefId,
                            String username) throws IOException {

        if (file == null || file.isEmpty()) {
            System.out.println("파일이 선택되지 않았습니다.");
            return;
        }

        FileDto fileDto = fileUploadsUtils.saveFile(file, fileGbnCd, fileRefId, username);

        try{

            File fileEntity = modelMapper.map(fileDto, File.class);

            System.out.println(fileEntity + "----------------");
            fileRepository.save(fileEntity);
        }catch(Exception e){
            fileUploadsUtils.deleteFile(fileDto.getFileUrl());
            throw new RuntimeException("파일 데이터 저장 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 파일 ID로 파일 삭제
     * @param fileId 파일 ID
     */

    @Transactional
    public void deleteFileById(Integer fileId) {
        Optional<File> optionalFile = fileRepository.findById(fileId);
        optionalFile.orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다. ID: " + fileId));

        try{
            fileUploadsUtils.deleteFile(optionalFile.get().getFileUrl());
            fileRepository.deleteById(fileId);
        }catch (Exception e){
            throw new RuntimeException("파일 삭제 실패: " + e.getMessage(), e);
        }
    }

    public File findFileByFileRefIdAndFileGubnCode(String fileRefId, String fileGubnCode) {
        File file = fileRepository.findFileByFileRefIdAndFileGubnCode(fileRefId, fileGubnCode);
        return file;
    }
}
