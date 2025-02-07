package org.miniProject.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.miniProject.backend.dto.Request.RequestLoginDto;
import org.miniProject.backend.dto.Request.RequestUserDto;
import org.miniProject.backend.entity.User;
import org.miniProject.backend.service.UserService;
import org.miniProject.backend.utils.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/user")
    public ResponseEntity<?> addUser(@ModelAttribute RequestUserDto requestUserDto) throws IOException {
        System.out.println("받은 사용자 정보: " + requestUserDto);
        userService.joinUser(requestUserDto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        boolean isExist = userService.findUserByUsername(username);

        Map<String, Boolean> response = new HashMap<>();
        response.put("available", isExist);

        return ResponseEntity.ok(response);
    }


}
