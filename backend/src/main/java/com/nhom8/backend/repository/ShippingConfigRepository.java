package com.nhom8.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom8.backend.model.ShippingConfig;
    
@Repository
public interface ShippingConfigRepository extends JpaRepository<ShippingConfig, Integer> {
    Optional<ShippingConfig> findByAreaName(String areaName);
}
