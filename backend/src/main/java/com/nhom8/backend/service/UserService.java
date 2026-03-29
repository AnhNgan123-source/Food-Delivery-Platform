package com.nhom8.backend.service;

import com.nhom8.backend.model.User;
import com.nhom8.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        
        // Bảo mật: Không gửi password về client
        user.setPassword(null); 
        return user;
    }
   public User updateProfile(String username, User newData) {
    // 1. Tìm user cũ trong database
    User existingUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Ngân ơi, không tìm thấy người dùng này!"));

    // 2. Lấy thông tin MỚI từ client (newData) đắp vào user CŨ (existingUser)
    // Chỗ này Ngân phải gọi newData.get... thì nó mới lấy dữ liệu mới nhé!
    existingUser.setFull_name(newData.getFull_name());
    existingUser.setEmail(newData.getEmail());
    existingUser.setPhone(newData.getPhone());
    
    // Nếu Ngân có dùng địa chỉ thì mở comment dòng dưới ra:
    // existingUser.setAddress(newData.getAddress());

    // 3. Lưu xuống Database
    return userRepository.save(existingUser);
}
}