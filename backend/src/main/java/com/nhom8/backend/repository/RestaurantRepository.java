package com.nhom8.backend.repository;

import com.nhom8.backend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    Optional<Restaurant> findByOwnerId(Integer ownerId);
    
    @Query(value = "SELECT * FROM Restaurant WHERE is_active = 1", nativeQuery = true)
    List<Restaurant> getActiveRestaurants();
}