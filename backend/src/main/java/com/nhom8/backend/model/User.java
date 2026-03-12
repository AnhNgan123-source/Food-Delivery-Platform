package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Data // Tự động tạo Getter/Setter nếu Ngân có cài Lombok
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ADMIN', 'CUSTOMER', 'RESTAURANT')")
    private Role role;

    private String full_name;
    private String phone;
    private String address;
    
    private Integer is_active = 1;

    @Column(updatable = false)
    private LocalDateTime created_at;
    
    private LocalDateTime updated_at;

    // Tự động gán thời gian khi tạo mới
    @PrePersist
    protected void onCreate() {
        created_at = LocalDateTime.now();
        updated_at = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updated_at = LocalDateTime.now();
    }
}