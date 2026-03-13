package com.nhom8.backend.service;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    // ===============================
    // RESTAURANT - chức năng 7,8,12
    // ===============================

    // lấy thông tin quán theo owner
    public Restaurant getRestaurantByOwner(Integer ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Không tim thấy nhà hàng"));
    }

    // update thông tin quán
    public Restaurant updateRestaurant(Integer resId, Restaurant newData) {

        Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        res.setResName(newData.getResName());
        res.setResAddress(newData.getResAddress());
        res.setResImage(newData.getResImage());

        return restaurantRepository.save(res);
    }

    // ===============================
    // ADMIN - chức năng 14
    // ===============================

    /*
     * ADMIN: Lấy danh sách tất cả nhà hàng
     */
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    /*
     * ADMIN: Lấy chi tiết 1 nhà hàng
     */
    public Restaurant getRestaurantById(Integer resId) {

        return restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    /*
     * ADMIN: Tạo nhà hàng mới
     */
    public Restaurant createRestaurant(Restaurant restaurant) {

        return restaurantRepository.save(restaurant);
    }

    /*
     * ADMIN: Cập nhật nhà hàng
     */
    public Restaurant adminUpdateRestaurant(Integer resId, Restaurant newData) {

        Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        res.setResName(newData.getResName());
        res.setResAddress(newData.getResAddress());
        res.setResImage(newData.getResImage());
        res.setOwnerId(newData.getOwnerId());
        res.setIsActive(newData.getIsActive());

        return restaurantRepository.save(res);
    }

    /*
     * ADMIN: Xóa nhà hàng
     */
    public void deleteRestaurant(Integer resId) {

        Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        restaurantRepository.delete(res);
    }

}