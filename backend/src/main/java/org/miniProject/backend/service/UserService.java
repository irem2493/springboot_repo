package org.miniProject.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.miniProject.backend.dto.Request.RequestUserDto;
import org.miniProject.backend.entity.File;
import org.miniProject.backend.entity.User;
import org.miniProject.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileService fileService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void joinUser(RequestUserDto requestUserDto) throws IOException {

        String encryptedPassword = passwordEncoder.encode(requestUserDto.getPassword());
        requestUserDto.setPassword(encryptedPassword);

        User user = User.builder()
                .username(requestUserDto.getUsername())
                .password(requestUserDto.getPassword())
                .name(requestUserDto.getName())
                .birth(requestUserDto.getBirth())
                .gender(requestUserDto.getGender())
                .role("ROLE_USER")
                .joindate(LocalDateTime.now())
                .deletedYN('N')
                .build();
        userRepository.save(user);


        requestUserDto.setFileGbnCd("Join");
        requestUserDto.setFileRefId(requestUserDto.getUsername());

        fileService.saveFile(requestUserDto.getFile(), requestUserDto.getFileGbnCd(), requestUserDto.getFileRefId(), requestUserDto.getUsername());


    }
}
