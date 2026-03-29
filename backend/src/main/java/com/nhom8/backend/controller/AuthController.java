package com.nhom8.backend.controller;

import com.nhom8.backend.config.JwtUtil;
import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.model.Role;
import com.nhom8.backend.model.User;
import com.nhom8.backend.repository.RestaurantRepository;
import com.nhom8.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // THÊM DÒNG NÀY ĐỂ MỞ CỬA CHO REACT
public class AuthController {

    @Autowired private UserRepository userRepository;

    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private JwtUtil jwtUtil; // Gọi công cụ JWT vào

    @Autowired private RestaurantRepository restaurantRepository; // Nhớ Inject cái này ở đầu Class nhé Ngân

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

        // === ĐOẠN QUAN TRỌNG ĐÂY NGÂN ƠI ===
        if (user.getRole() == Role.RESTAURANT) {
            Optional<Restaurant> resOpt = restaurantRepository.findByOwnerId(user.getUserId());
            if (resOpt.isPresent()) {
                data.put("resId", resOpt.get().getResId()); // Nhét số 16 vào đây
            }
        }
        // ===================================

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
    if (user.getUserName() == null || user.getUserName().trim().isEmpty() ||
        user.getPassWord() == null || user.getPassWord().trim().isEmpty() ||
        user.getEmail() == null || user.getEmail().trim().isEmpty()) {
        
        response.put("status", "error");
        response.put("message", "Vui lòng nhập đầy đủ các trường bắt buộc!");
        return response;
    }

    // 2. Kiểm tra tên đăng nhập đã tồn tại chưa 
    if (userRepository.findByUserName(user.getUserName()).isPresent()) {
        response.put("status", "error");
        response.put("message", "Tên đăng nhập đã tồn tại!");
        return response;
    }
    // Dòng này sẽ biến "123456" thành chuỗi bảo mật trước khi lưu vào MySQL
    user.setPassWord(passwordEncoder.encode(user.getPassWord()));
    user.setIsActive(1);
    
    User savedUser = userRepository.save(user);

    // Nếu chọn vai trò là RESTAURANT, tự động tạo 1 bản ghi nhà hàng trống
        if (Role.RESTAURANT.equals(savedUser.getRole())) {
            Restaurant newRes = new Restaurant();
            newRes.setOwnerId(savedUser.getUserId()); // Gắn với chủ vừa tạo
            newRes.setResName("Nhà hàng của " + (savedUser.getFullName() != null ? savedUser.getFullName() : savedUser.getUserName()));
            newRes.setResAddress(savedUser.getAddress() != null ? savedUser.getAddress() : "Chưa cập nhật địa chỉ");
            newRes.setRatingAvg(BigDecimal.ZERO);
            newRes.setIsActive(0); // Chờ Admin duyệt mới cho bán

            restaurantRepository.save(newRes);
        }
        // ------------------------------------
    
    response.put("status", "success");
    response.put("message", "Đăng ký thành công!");
    return response;
}
}