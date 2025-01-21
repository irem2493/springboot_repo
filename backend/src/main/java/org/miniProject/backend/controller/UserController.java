package org.miniProject.backend.controller;

import lombok.RequiredArgsConstructor;
import org.miniProject.backend.dto.Request.RequestUserDto;
import org.miniProject.backend.service.FileService;
import org.miniProject.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileService fileService;

    @PostMapping("/user")
    public ResponseEntity<String> addUser(@ModelAttribute RequestUserDto requestUserDto) throws IOException {
        System.out.println("받은 사용자 정보: " + requestUserDto);
        userService.joinUser(requestUserDto);
        return ResponseEntity.ok("회원가입 성공");
    }
}
