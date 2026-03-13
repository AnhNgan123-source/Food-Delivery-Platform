package com.nhom8.backend.controller;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Controller dành riêng cho ADMIN quản lý nhà hàng
 *
 * Base URL:
 * /api/admin/restaurants
 */

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantController {

    private final RestaurantService restaurantService;

    public AdminRestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    /*
     * API 1
     * Lấy danh sách tất cả nhà hàng
     *
     * GET /api/admin/restaurants
     */
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    /*
     * API 2
     * Lấy chi tiết 1 nhà hàng
     *
     * GET /api/admin/restaurants/{id}
     */
    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable Integer id) {
        return restaurantService.getRestaurantById(id);
    }

    /*
     * API 3
     * Tạo nhà hàng mới
     *
     * POST /api/admin/restaurants
     */
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.createRestaurant(restaurant);
    }

    /*
     * API 4
     * Cập nhật nhà hàng
     *
     * PUT /api/admin/restaurants/{id}
     */
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable Integer id,
            @RequestBody Restaurant restaurant) {

        return restaurantService.adminUpdateRestaurant(id, restaurant);
    }

    /*
     * API 5
     * Xóa nhà hàng
     *
     * DELETE /api/admin/restaurants/{id}
     */
    @DeleteMapping("/{id}")
    public String deleteRestaurant(@PathVariable Integer id) {

        restaurantService.deleteRestaurant(id);

        return "Xóa nhà hàng thành công";
    }
}