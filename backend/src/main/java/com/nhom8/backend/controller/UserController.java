package com.nhom8.backend.controller;

import com.nhom8.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        // authentication.getName() sẽ lấy username từ Token JWT
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }
}