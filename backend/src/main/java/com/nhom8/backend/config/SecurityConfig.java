package com.nhom8.backend.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable()) // Tắt CSRF vì mình dùng JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Giữ nguyên các file tĩnh
                        .requestMatchers("/", "/index.html", "/admin.html", "/restaurant.html",
                                "/customer.html", "/css/**", "/js/**", "/image/**",
                                "/auth/**", "/fragments/**", "/favicon.ico/**", "/assets/**")
                        .permitAll()
                        .requestMatchers("/api/menu/uploads/**").permitAll()

                // Cho phép truy cập thư mục uploads chung (để xem hình ảnh nhà hàng)
                        .requestMatchers("/uploads/**").permitAll()

                        // Cho phép API upload ảnh hoạt động
                        .requestMatchers("/api/v1/restaurant/upload").permitAll()

                        // SỬA 1: Mở rộng đường dẫn cho Auth
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        .requestMatchers("/ws-delivery/**").permitAll()

                        // SỬA 2: Cho phép các API liên quan đến Menu và Category
                        .requestMatchers("/api/menu/**").permitAll()
                        .requestMatchers("/api/user/**").permitAll()
                        .requestMatchers("/api/v1/admin/**").permitAll()
                        .requestMatchers("/api/v1/orders/**").permitAll()

                        .requestMatchers("/api/v1/restaurants/**").permitAll()
                        .requestMatchers("/api/v1/restaurant/**").permitAll()
                        .requestMatchers("/api/user/profile/**").authenticated()

                        // SỬA 3: anyRequest permitAll để debug
                        .anyRequest().permitAll());
        // Thêm Filter kiểm tra Token trước khi vào các hàm xử lý
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép Frontend của Ngân (Vite dùng port 5173)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}