package com.nhom8.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom8.backend.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Hàm này giúp tìm User dựa trên username để kiểm tra đăng nhập
    Optional<User> findByUsername(String username);
}
