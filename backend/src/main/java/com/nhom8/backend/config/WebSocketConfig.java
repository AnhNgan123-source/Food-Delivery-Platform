package com.nhom8.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "Trạm phát" cho các thông báo (Topic)
        config.enableSimpleBroker("/topic");
        // Tiền tố cho các tin nhắn từ Client gửi lên (nếu có)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Cổng kết nối chính của React (Dùng SockJS để hỗ trợ mọi trình duyệt)
        registry.addEndpoint("/ws-delivery")
                .setAllowedOrigins("http://localhost:5173") // Cổng React
                .withSockJS();
    }
}