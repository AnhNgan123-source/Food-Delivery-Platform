package com.nhom8.backend.controller;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // lấy thông tin quán
    @GetMapping("/owner/{ownerId}")
    public Restaurant getRestaurant(@PathVariable Integer ownerId) {
        return restaurantService.getRestaurantByOwner(ownerId);
    }

    // update thông tin quán
    @PutMapping("/{resId}")
    public Restaurant updateRestaurant(
            @PathVariable Integer resId,
            @RequestBody Restaurant restaurant) {

        return restaurantService.updateRestaurant(resId, restaurant);
    }
}