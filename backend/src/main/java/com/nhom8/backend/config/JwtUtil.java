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
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 1. Hàm tạo Token (ĐÃ SỬA: Nhận thêm Role để nhét vào Token)
    public String generateToken(String username, String role) {
        long expiration = role.equals("ADMIN") ? 7200000L : 604800000L;// (2ng - 7ng)
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // << QUAN TRỌNG: Nhét quyền vào thân Token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. Hàm lấy Username từ Token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 3. Hàm lấy Role từ Token 
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // 4. Hàm kiểm tra Token còn hạn hay không
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