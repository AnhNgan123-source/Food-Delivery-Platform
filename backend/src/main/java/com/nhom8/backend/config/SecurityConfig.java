package com.nhom8.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // CHỖ NÀY LÀ QUAN TRỌNG NHẤT: Khai báo "máy mã hóa" để hết lỗi gạch đỏ
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

 @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // Tạm thời disable để test API dễ hơn
        .authorizeHttpRequests(auth -> auth
            // 🛑 DÒNG QUAN TRỌNG NHẤT: Cho phép truy cập các file tĩnh
        .requestMatchers("/", "/index.html", "/admin.html", "/restaurant.html", "/customer.html", "/css/**", "/js/**", "/image/**", "/auth/**", "/fragments/**").permitAll()            .anyRequest().authenticated()
        );
    
    return http.build();
    }
}
