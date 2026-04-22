package com.nhom8.backend.controller;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Controller dành riêng cho ADMIN quản lý nhà hàng
 * * Base URL đã được sửa để khớp với Frontend:
 * /api/v1/admin/restaurants
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/admin/restaurants") // Thêm /v1/ để khớp với gọi lệnh từ Frontend
public class AdminRestaurantController {

    private final RestaurantService restaurantService;

    public AdminRestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    /*
     * API 1
     * Lấy danh sách tất cả nhà hàng
     * GET /api/v1/admin/restaurants
     */
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }
    /*
     * API 2
     * Lấy danh sách nhà hàng chờ duyệt
     * DELETE /api/v1/admin/restaurants/pending
     */
    @GetMapping("/pending")
    public List<Restaurant> getPendingRestaurants() {
    return restaurantService.getPendingRestaurants();
    }

    /*
     * API 3
     * Lấy danh sách nhà hàng đang hoạt động
     * DELETE /api/v1/admin/restaurants/active
     */ 
    @GetMapping("/active")
    public List<Restaurant> getActiveRestaurants() {
        return restaurantService.getActiveRestaurants();
    }

    /*
     * API 4
     * Lấy chi tiết 1 nhà hàng
     * GET /api/v1/admin/restaurants/{id}
     */
    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable Integer id) {
        return restaurantService.getRestaurantById(id);
    }

    /*
     * API 5
     * Tạo nhà hàng mới
     * POST /api/v1/admin/restaurants
     */
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.createRestaurant(restaurant);
    }

    /*
     * API 6
     * Cập nhật nhà hàng (Dùng để sửa thông tin hoặc Duyệt/Khóa qua isActive)
     * PUT /api/v1/admin/restaurants/{id}
     */
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable Integer id,
            @RequestBody Restaurant restaurant) {

        return restaurantService.adminUpdateRestaurant(id, restaurant);
    }

    /*
     * API 7
     * Xóa nhà hàng
     * DELETE /api/v1/admin/restaurants/{id}
     */
    @DeleteMapping("/{id}")
    public String deleteRestaurant(@PathVariable Integer id) {
        restaurantService.deleteRestaurant(id);
        return "Xóa nhà hàng thành công";
    }

}