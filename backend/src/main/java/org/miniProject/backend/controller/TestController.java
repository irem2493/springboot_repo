package org.miniProject.backend.controller;

import org.miniProject.backend.dto.TestDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TestController {

    // 제품 목록을 반환하는 API
    @GetMapping("/products")
    public List<TestDto> getProducts() {
        // 실제 DB나 서비스에서 데이터 가져오는 부분
        return List.of(
                new TestDto(1, "Product 1"),
                new TestDto(2, "Product 2")
        );
    }
}
