package com.nhom8.backend.controller;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.service.RestaurantService;
import com.nhom8.backend.repository.RestaurantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1") // Thống nhất v1 cho giống các Controller khác nhé Ngân
//@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Constructor Injection cho Service
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    /**
     * 1. Lấy thông tin quán theo Owner ID (Dùng cho chủ quán xem dashboard)
     */
    @GetMapping("/restaurant/owner/{ownerId}")
    public ResponseEntity<?> getRestaurant(@PathVariable Integer ownerId) {
        Restaurant res = restaurantService.getRestaurantByOwner(ownerId);
        if (res != null) {
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 2. API Update thông tin quán (Dành cho ADMIN)
     */
    @PutMapping("/admin/restaurants/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable Integer id, @RequestBody Restaurant restaurantDetails) {
        return restaurantRepository.findById(id).map(existingRes -> {
            
            // Cập nhật các thông tin từ Body gửi lên
            existingRes.setResName(restaurantDetails.getResName());
            existingRes.setResAddress(restaurantDetails.getResAddress());
            existingRes.setResImage(restaurantDetails.getResImage());
            existingRes.setRatingAvg(restaurantDetails.getRatingAvg());
            existingRes.setIsActive(restaurantDetails.getIsActive());
            
            // Lưu lại vào Database
            restaurantRepository.save(existingRes);
            
            // Trả về thông báo thành công dưới dạng JSON cho chuyên nghiệp
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Cập nhật thành công nhà hàng ID: " + id);
            
            return ResponseEntity.ok(response);
            
        }).orElse(ResponseEntity.notFound().build());
    }
}