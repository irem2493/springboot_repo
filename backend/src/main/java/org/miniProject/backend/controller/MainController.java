package org.miniProject.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.miniProject.backend.dto.Request.RequestLoginDto;
import org.miniProject.backend.entity.User;
import org.miniProject.backend.service.UserService;
import org.miniProject.backend.utils.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MainController {

    private final UserService userService;
    private final JWTUtil jwtUtil;


    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @CookieValue(value = "authToken", required = false) String authToken) {

        // 토큰 추출 (Optional 활용)
        String token = Optional.ofNullable(authorizationHeader)
                .filter(auth -> auth.startsWith("Bearer "))
                .map(auth -> auth.substring(7))
                .orElse(authToken);

        if (token == null || jwtUtil.isExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증이 필요합니다.");
        }

        String username = jwtUtil.getUsername(token);
        User user = userService.findByUsername(username);

        return user != null ? ResponseEntity.ok(user)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
    }
}
