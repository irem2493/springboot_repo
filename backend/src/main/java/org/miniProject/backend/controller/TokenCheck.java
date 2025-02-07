package org.miniProject.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.miniProject.backend.dto.TokenUserDto;
import org.miniProject.backend.entity.File;
import org.miniProject.backend.repository.FileRepository;
import org.miniProject.backend.utils.JWTUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
public class TokenCheck {
    private final JWTUtil jwtUtil;
    //TODO: 시간 관계상 여기서 처리
    private final FileRepository fileRepository;


    @PostMapping("/verify-token")
    public TokenUserDto verifyToken(HttpServletRequest request) {

        String authorization = request.getHeader("Authorization");
        log.info("Authorization 헤더 값: {}", authorization);

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);

            String username = jwtUtil.getUsername(token);
            String role = jwtUtil.getRole(token);
            String name = jwtUtil.getName(token);


            File file = fileRepository.findFileByFileRefIdAndFileGubnCode(username,( role.equals("ROLE_USER")  || role.equals("ROLE_ADMIN"))? "profile_user" : "profile_manager");

            if (file == null) {
                log.warn("파일 정보를 찾을 수 없습니다. username: {}, role: {}", username, role);
            } else {
                log.info("유저 정보 - username: {}, role: {}, name: {}, fileUrl: {}", username, role, name, file.getFileUrl());
            }

            TokenUserDto userDto = new TokenUserDto();
            userDto.setUsername(username);
            userDto.setRole(role);
            userDto.setName(name);
            userDto.setFileUrl(file != null ? file.getFileUrl() : null);

            return userDto;
        }
        log.error("Authorization 헤더가 없거나 올바르지 않습니다.");
        return null;
    }
}
