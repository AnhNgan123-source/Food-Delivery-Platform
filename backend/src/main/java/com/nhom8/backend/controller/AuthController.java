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
@RequestMapping("api/v1/auth")
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

        Optional<User> userOpt = userRepository.findByUserName(username);
        Map<String, Object> response = new HashMap<>();

    if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassWord())) {
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getUserName(), user.getRole().name());
        
        // Đổi Map<String, String> thành Map<String, Object> để gửi được cả ID (Long/Integer)
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("role", user.getRole().toString());
        data.put("id", user.getUserId());
        data.put("username", user.getUserName() ); // Đây là ID người dùng (số 10)
            // --- SỬA LOGIC LẤY RESTAURANT ID ---
            if (user.getRole().toString().equals("RESTAURANT")) {
                // Thay vì lấy user_id,tìm res_id thật trong bảng Restaurant 
                Optional<Restaurant> resOpt = restaurantRepository.findByOwnerId(user.getUserId());
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

        if (user.getUserName() == null || user.getUserName().trim().isEmpty() ||
                user.getPassWord() == null || user.getPassWord().trim().isEmpty() ||
                user.getEmail() == null || user.getEmail().trim().isEmpty()) {

            response.put("status", "error");
            response.put("message", "Vui lòng nhập đầy đủ các trường bắt buộc!");
            return response;
        }

        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            response.put("status", "error");
            response.put("message", "Tên đăng nhập đã tồn tại!");
            return response;
        }

        user.setPassWord(passwordEncoder.encode(user.getPassWord()));
        user.setIsActive(1);

        // Lưu User vào database
        User savedUser = userRepository.save(user);

        // --- BẮT ĐẦU PHẦN THÊM MỚI ---
        if ("RESTAURANT".equals(savedUser.getRole().toString())) {
            Restaurant newRes = new Restaurant();
            newRes.setOwnerId(savedUser.getUserId()); 
            newRes.setResName("Nhà hàng của " + savedUser.getFullName());
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