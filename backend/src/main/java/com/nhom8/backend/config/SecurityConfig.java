package com.nhom8.backend.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter; // Đảm bảo Ngân đã tạo file JwtFilter mình đưa ở trên

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // Cho phép Frontend gọi API
            .csrf(csrf -> csrf.disable())    // Tắt CSRF để dùng JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không dùng Session truyền thống
            .authorizeHttpRequests(auth -> auth
                // Cho phép xem giao diện tĩnh
                .requestMatchers("/", "/index.html", "/admin.html", "/restaurant.html", 
                               "/customer.html", "/css/**", "/js/**", "/image/**", 
                               "/auth/**", "/fragments/**", "/favicon.ico/**").permitAll()
                // API đăng nhập không cần token
                .requestMatchers("/api/auth/**").permitAll()
                // API Profile BẮT BUỘC phải đăng nhập
                .requestMatchers("/api/user/profile").authenticated()
                .anyRequest().authenticated()
            );

        // QUAN TRỌNG: Chèn bộ lọc JWT vào trước quy trình kiểm tra của Spring
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }
}