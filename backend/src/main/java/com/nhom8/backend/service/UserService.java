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
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        
        // Bảo mật: Không gửi password về client
        user.setPassWord(null); 
        return user;
    }
   public User updateProfile(String username, User newData) {
    // 1. Tìm user cũ trong database
    User existingUser = userRepository.findByUserName(username)
            .orElseThrow(() -> new RuntimeException("Ngân ơi, không tìm thấy người dùng này!"));

    // 2. Lấy thông tin MỚI từ client (newData) đắp vào user CŨ (existingUser)
    // Chỗ này phải gọi newData.get... thì nó mới lấy dữ liệu mới nhé!
    existingUser.setFullName(newData.getFullName());
    existingUser.setEmail(newData.getEmail());
    existingUser.setPhone(newData.getPhone());
 

    // 3. Lưu xuống Database
    return userRepository.save(existingUser);
}
}