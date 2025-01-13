package org.miniProject.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping(value = {"/", "/join"})
    public String index() {
        return "forward:/index.html";  // React의 index.html 서빙
    }


}
