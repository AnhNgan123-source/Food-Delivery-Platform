package com.nhom8.backend.repository;

import com.nhom8.backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    // 1. Dành cho Chủ nhà hàng
    @Query(value = "SELECT * FROM Menu_Item WHERE res_id = :resId", nativeQuery = true)
    List<MenuItem> findAllByRestaurant(@Param("resId") Integer resId);

    // 2. Dành cho Khách hàng
    @Query(value = "SELECT * FROM Menu_Item WHERE res_id = :resId AND is_available = 1", nativeQuery = true)
    List<MenuItem> findAvailableMenu(@Param("resId") Integer resId);

    @Query(value = "SELECT * FROM Menu_Item WHERE res_id = :resId AND is_available = 1", nativeQuery = true)
    List<MenuItem> findByResId(Integer resId);



}