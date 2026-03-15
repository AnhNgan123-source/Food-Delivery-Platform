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
}