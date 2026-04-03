package com.nhom8.backend.repository;

import com.nhom8.backend.model.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipperRepository extends JpaRepository<Shipper, Integer> {
    List<Shipper> findByStatus(Shipper.ShipperStatus status);
}