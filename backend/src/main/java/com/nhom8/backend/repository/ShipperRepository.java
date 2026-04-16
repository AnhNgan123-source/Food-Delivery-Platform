package com.nhom8.backend.repository;

import com.nhom8.backend.model.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipperRepository extends JpaRepository<Shipper, Integer> {
    List<Shipper> findByRestaurantResId(Integer resId);
    
    List<Shipper> findByRestaurantResIdAndStatus(Integer resId, Shipper.ShipperStatus status);
}