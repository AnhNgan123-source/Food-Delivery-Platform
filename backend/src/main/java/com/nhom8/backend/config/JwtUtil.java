package com.nhom8.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "Nhom8FoodDeliveryPlatformSecretKeyVeryLongValue"; 
    private final long EXPIRATION_TIME = 86400000; // Token có hạn trong 1 ngày

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Hàm tạo Token xịn dựa trên username
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}