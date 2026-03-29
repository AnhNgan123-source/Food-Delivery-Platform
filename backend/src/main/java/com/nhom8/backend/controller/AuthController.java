package com.nhom8.backend.controller;

import com.nhom8.backend.config.JwtUtil;
import com.nhom8.backend.model.User;
import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.repository.UserRepository;
import com.nhom8.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            User user = userOpt.get();
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("role", user.getRole().toString());
            data.put("id", user.getUser_id()); // Vẫn trả về id của user để dùng làm profile

            // --- SỬA LOGIC LẤY RESTAURANT ID ---
            if (user.getRole().toString().equals("RESTAURANT")) {
                // Thay vì lấy user_id, ta tìm res_id thật trong bảng Restaurant
                Optional<Restaurant> resOpt = restaurantRepository.findByOwnerId(user.getUser_id());
                if (resOpt.isPresent()) {
                    data.put("restaurantId", resOpt.get().getResId()); // Lấy res_id từ bảng Restaurant
                } else {
                    data.put("restaurantId", null);
                }
            }
            // ----------------------------------

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

        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
                user.getPassword() == null || user.getPassword().trim().isEmpty() ||
                user.getEmail() == null || user.getEmail().trim().isEmpty()) {

            response.put("status", "error");
            response.put("message", "Vui lòng nhập đầy đủ các trường bắt buộc!");
            return response;
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            response.put("status", "error");
            response.put("message", "Tên đăng nhập đã tồn tại!");
            return response;
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIs_active(1);

        // Lưu User vào database
        User savedUser = userRepository.save(user);

        // --- BẮT ĐẦU PHẦN THÊM MỚI ---
        if ("RESTAURANT".equals(savedUser.getRole().toString())) {
            Restaurant newRes = new Restaurant();
            newRes.setOwnerId(savedUser.getUser_id()); 
            newRes.setResName("Nhà hàng của " + savedUser.getFull_name());
            newRes.setResAddress(savedUser.getAddress() != null ? savedUser.getAddress() : "Chưa cập nhật địa chỉ");
            newRes.setRatingAvg(BigDecimal.ZERO);
            newRes.setIsActive(0); 

            restaurantRepository.save(newRes);
        }
        // --- KẾT THÚC PHẦN THÊM MỚI ---
        
        response.put("status", "success");
        response.put("message", "Đăng ký thành công!");
        return response;
    }
}