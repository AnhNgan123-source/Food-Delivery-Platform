package com.nhom8.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ánh xạ link web /uploads/** vào thư mục vật lý uploads/ trên máy tính
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}