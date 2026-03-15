package com.nhom8.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    // Lưu ý: Key phải đủ dài (ít nhất 32 ký tự)
    private final String SECRET_KEY = "Nhom8FoodDeliveryPlatformSecretKeyVeryLongValueForSecurity"; 
    private final long EXPIRATION_TIME = 86400000; // 24 giờ

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 1. Hàm tạo Token (Dùng khi Đăng nhập thành công)
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. Hàm lấy Username từ Token (Dùng để biết ai đang gọi API Profile)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 3. Hàm kiểm tra Token còn hạn hay không
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Hàm hỗ trợ trích xuất thông tin (Claims)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}