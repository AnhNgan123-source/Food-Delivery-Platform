package com.nhom8.backend.service;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.model.User;
import com.nhom8.backend.repository.RestaurantRepository;
import com.nhom8.backend.repository.UserRepository; // Đảm bảo đúng tên file repository của ông
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository; 

    public RestaurantService(RestaurantRepository restaurantRepository, UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    // ===============================
    // RESTAURANT - chức năng 7,8,12
    // ===============================

    // lấy thông tin quán theo owner
    public Restaurant getRestaurantByOwner(Integer ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà hàng"));
    }

    // UPDATE THÔNG TIN QUÁN VÀ ĐỒNG BỘ BẢNG USER
    @Transactional 
    public Restaurant updateRestaurant(Integer resId, Restaurant newData) {

        // 1. Cập nhật bảng Restaurant
        Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        res.setResName(newData.getResName());
        res.setResAddress(newData.getResAddress());

        if (newData.getResImage() != null && !newData.getResImage().trim().isEmpty()) {
            res.setResImage(newData.getResImage());
        }

        Restaurant updatedRes = restaurantRepository.save(res);

        // 2. Cập nhật bảng User (Đồng bộ tên quán vào fullName và địa chỉ vào address)
        userRepository.findById(res.getOwnerId()).ifPresent(user -> {
            user.setFullName(newData.getResName());
            user.setAddress(newData.getResAddress());
            userRepository.save(user);
        });

        return updatedRes;
    }

    // ===============================
    // ADMIN - chức năng 14
    // ===============================

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

<<<<<<< HEAD
    /*
     * ADMIN: Lấy danh sách tất cả nhà hàng đang hoạt động
     */
    public List<Restaurant> getActiveRestaurants() {
        return restaurantRepository.getActiveRestaurants();
    }

    /*
     * ADMIN: Lấy danh sách tất cả nhà hàng cần duyệt
     */
    public List<Restaurant> getPendingRestaurants() {
        return restaurantRepository.getPendingRestaurants();
    }

    /*
     * ADMIN: Lấy chi tiết 1 nhà hàng
     */
    public Restaurant getRestaurantById(Integer resId) {
=======
    public List<Restaurant> getActiveRestaurants() {
        return restaurantRepository.getActiveRestaurants();
    }
>>>>>>> origin/main

    public List<Restaurant> getPendingRestaurants() {
        return restaurantRepository.getPendingRestaurants();
    }

    public Restaurant getRestaurantById(Integer resId) {
        return restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    public Restaurant adminUpdateRestaurant(Integer resId, Restaurant newData) {
        Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        res.setResName(newData.getResName());
        res.setResAddress(newData.getResAddress());
        res.setResImage(newData.getResImage());
        res.setOwnerId(newData.getOwnerId());
        res.setIsActive(newData.getIsActive());

        // Admin update cũng nên đồng bộ qua User nếu cần
        userRepository.findById(res.getOwnerId()).ifPresent(user -> {
            user.setFullName(newData.getResName());
            user.setAddress(newData.getResAddress());
            userRepository.save(user);
        });

        return restaurantRepository.save(res);
    }

    public void deleteRestaurant(Integer resId) {
        Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        restaurantRepository.delete(res);
    }
}