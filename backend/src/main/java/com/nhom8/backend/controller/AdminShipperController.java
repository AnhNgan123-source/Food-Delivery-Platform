package com.nhom8.backend.controller;

import com.nhom8.backend.model.Shipper;
import com.nhom8.backend.repository.ShipperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/shippers")
@CrossOrigin("*")
public class AdminShipperController {

    @Autowired
    private ShipperRepository shipperRepository;

    @GetMapping
    public ResponseEntity<?> getAllShippers() {
        return ResponseEntity.ok(Map.of("status", "success", "data", shipperRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<?> createShipper(@RequestBody Shipper shipper) {
        return ResponseEntity.ok(Map.of("status", "success", "data", shipperRepository.save(shipper)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShipper(@PathVariable Integer id) {
        shipperRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Đã xóa shipper"));
    }
    
    @GetMapping("/available")
    public ResponseEntity<?> getIdleShippers() {
        return ResponseEntity.ok(Map.of("status", "success", "data", shipperRepository.findByStatus(Shipper.ShipperStatus.IDLE)));
    }
}