package com.nhom8.backend.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // Danh sách các địa chỉ không cần đăng nhập
    private static final String[] PUBLIC_ENDPOINTS = {
        "/", "/index.html", "/auth/**", "/api/v1/auth/**",
        "/ws-delivery/**", "/uploads/**", "/api/menu/**", 
        "/api/categories/**", "/css/**", "/js/**", "/image/**", "/assets/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // Mở khóa các API xem danh sách (GET) để khách vãng lai xem được
                .requestMatchers(HttpMethod.GET, "/api/v1/restaurants/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/admin/shipping-config").permitAll()
                
                // 1. Công khai các tài nguyên cơ bản
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                
                // 2. Phân quyền cụ thể
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/restaurants/**").hasAnyRole("ADMIN", "RESTAURANT")
                .requestMatchers("/api/user/profile/**").authenticated()
                
                // 3. Tất cả các request còn lại ĐỀU PHẢI ĐĂNG NHẬP
                .anyRequest().authenticated()
            );

        // Thêm filter kiểm tra JWT trước khi xử lý request
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // CHỈ cho phép Frontend của bạn truy cập
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); 
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}