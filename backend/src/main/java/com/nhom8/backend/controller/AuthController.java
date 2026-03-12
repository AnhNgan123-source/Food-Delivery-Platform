package com.nhom8.backend.controller;

import com.nhom8.backend.config.JwtUtil;
import com.nhom8.backend.model.User;
import com.nhom8.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;

    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private JwtUtil jwtUtil; // Gọi công cụ JWT vào

   @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
    String username = request.get("username");
    String password = request.get("password");

    Optional<User> userOpt = userRepository.findByUsername(username);
    Map<String, Object> response = new HashMap<>();

    if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
        // TẠO TOKEN THẬT Ở ĐÂY
        String token = jwtUtil.generateToken(username);
        
        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        data.put("role", userOpt.get().getRole().toString());

        response.put("status", "success");
        response.put("data", data);
    } else {
        response.put("status", "error");
        response.put("message", "Sai tài khoản hoặc mật khẩu!");
    }
    return response;
}

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
    Map<String, Object> response = new HashMap<>();
    
    // 1. Chặn nếu để trống các trường bắt buộc
    if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
        user.getPassword() == null || user.getPassword().trim().isEmpty() ||
        user.getEmail() == null || user.getEmail().trim().isEmpty()) {
        
        response.put("status", "error");
        response.put("message", "Vui lòng nhập đầy đủ các trường bắt buộc!");
        return response;
    }

    // 2. Kiểm tra tên đăng nhập đã tồn tại chưa 
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        response.put("status", "error");
        response.put("message", "Tên đăng nhập đã tồn tại!");
        return response;
    }
    // Dòng này sẽ biến "123456" thành chuỗi bảo mật trước khi lưu vào MySQL
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setIs_active(1);
    
    userRepository.save(user);
    
    response.put("status", "success");
    response.put("message", "Đăng ký thành công!");
    return response;
}
}