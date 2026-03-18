package com.nhom8.backend.controller;

import com.nhom8.backend.model.User;
import com.nhom8.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user")
//@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        // authentication.getName() sẽ lấy username từ Token JWT
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody User user, Authentication authentication) {
    // Logic: Dựa vào authentication.getName() để tìm User trong DB và save() lại
    return ResponseEntity.ok(userService.updateProfile(authentication.getName(), user));
}
}