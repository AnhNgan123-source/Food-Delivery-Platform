package com.nhom8.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Lấy Header Authorization từ Request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Kiểm tra xem Header có hợp lệ không (phải bắt đầu bằng "Bearer ")
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Trích xuất Token (bỏ qua 7 ký tự đầu "Bearer ")
        jwt = authHeader.substring(7);
        
        try {
            // 4. Dùng JwtUtil để lấy username từ Token
            username = jwtUtil.extractUsername(jwt);

            // 5. Nếu lấy được username và chưa được xác thực trong SecurityContext
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 6. Kiểm tra Token còn hạn và đúng chữ ký không
                if (jwtUtil.validateToken(jwt)) {
                    // Tạo đối tượng xác thực cho Spring Security
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            new ArrayList<>() // Ở đây Ngân có thể thêm danh sách quyền (Roles) nếu muốn
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Ghi nhận người dùng đã đăng nhập thành công vào hệ thống
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Nếu Token sai hoặc hết hạn, in ra lỗi để Ngân dễ debug
            System.out.println("Lỗi xác thực JWT: " + e.getMessage());
        }

        // 7. Cho phép Request đi tiếp đến Controller
        filterChain.doFilter(request, response);
    }
}