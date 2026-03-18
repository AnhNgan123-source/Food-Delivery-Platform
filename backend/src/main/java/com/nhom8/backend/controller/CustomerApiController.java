package com.nhom8.backend.controller;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.service.MenuItemService;
import com.nhom8.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1") // Đúng Base URL theo tài liệu
public class CustomerApiController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Thêm 2 dòng này vào đúng chỗ vừa xóa:
    @Autowired
    private MenuItemService menuItemService;

    // 1. API: Tìm nhà hàng (GET /restaurants)
    @GetMapping("/restaurants")
    public ResponseEntity<?> getAllRestaurants() {
    List<Restaurant> restaurants = restaurantRepository.getActiveRestaurants();        
        // Đóng gói theo chuẩn {"status": "success", "data": [...]}
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", restaurants);
        
        return ResponseEntity.ok(response);
    }

    // 2. API: Xem menu nhà hàng (GET /restaurants/{res_id})
    @GetMapping("/restaurants/{res_id}")
    public ResponseEntity<?> getRestaurantMenu(@PathVariable Integer res_id) {
        Restaurant restaurant = restaurantRepository.findById(res_id).orElse(null);
        if (restaurant == null) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "error");
            err.put("message", "Không tìm thấy nhà hàng");
            return ResponseEntity.badRequest().body(err);
        }

        List<MenuItem> menu = menuItemService.getAvailableMenuForCustomer(res_id); 
        // Đóng gói data gồm cả thông tin nhà hàng và list món ăn
        Map<String, Object> data = new HashMap<>();
        data.put("restaurant", restaurant);
        data.put("menu", menu);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }
}