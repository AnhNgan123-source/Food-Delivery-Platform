package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    // Ép Java map biến userName vào cột username trong MySQL
    @Column(name = "username", nullable = false, unique = true)
    private String userName;

   // Ép Java map biến passWord vào cột password trong MySQL
    @Column(name = "password", nullable = false)
    private String passWord;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ADMIN', 'CUSTOMER', 'RESTAURANT')")
    private Role role;

    @Column(name = "full_name")
    private String fullName;

    private String phone;
    private String address;
    
    @Column(name = "is_active")
    private Integer isActive = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}