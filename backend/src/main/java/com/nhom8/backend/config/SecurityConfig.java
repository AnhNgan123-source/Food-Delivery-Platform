package com.nhom8.backend.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
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
                // 1. Cho phép xem giao diện tĩnh (Không cần đăng nhập)
                .requestMatchers("/", "/index.html", "/admin.html", "/restaurant.html", 
                               "/customer.html", "/css/**", "/js/**", "/image/**", 
                               "/auth/**", "/fragments/**", "/favicon.ico/**", "/assets/**").permitAll()
                
                // 2. API đăng ký/đăng nhập (Không cần đăng nhập)
                .requestMatchers("/api/auth/**").permitAll()
                
                // 3. API Dành cho ADMIN (Ví dụ: Thêm nhà hàng)
                // Yêu cầu: Bắt buộc phải có token và Role phải là ADMIN
                .requestMatchers("/api/v1/admin/**").permitAll()
                
                // 4. API Dành cho Khách hàng (Xem nhà hàng, menu)
                // Yêu cầu: Bắt buộc phải có token (Role CUSTOMER thường là hợp lý, nhưng ở đây có thể cho cả ADMIN/RESTAURANT xem thử)
                .requestMatchers("/api/v1/restaurants/**").authenticated() 

                // 5. API chung (Profile, Đổi mật khẩu...)
                // Yêu cầu: Đã đăng nhập (Bất kỳ Role nào)
                .requestMatchers("/api/user/profile/**").authenticated()
                
                // Các API khác chưa định nghĩa rõ: Bắt buộc đăng nhập
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