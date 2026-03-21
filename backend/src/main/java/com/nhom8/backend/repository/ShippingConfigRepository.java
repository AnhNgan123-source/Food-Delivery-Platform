package com.nhom8.backend.repository;

import com.nhom8.backend.model.ShippingConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingConfigRepository extends JpaRepository<ShippingConfig, Integer> {
    Optional<ShippingConfig> findByAreaName(String areaName);
}