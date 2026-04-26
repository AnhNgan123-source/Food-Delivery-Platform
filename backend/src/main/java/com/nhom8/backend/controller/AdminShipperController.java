package com.nhom8.backend.controller;

import com.nhom8.backend.dto.ResponseData;
import com.nhom8.backend.model.Shipper;
import com.nhom8.backend.service.ShipperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/shippers")
@RequiredArgsConstructor
public class AdminShipperController {
    private final ShipperService shipperService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(new ResponseData("success", shipperService.getAllShippers()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Shipper shipper) {
        return ResponseEntity.ok(new ResponseData("success", shipperService.saveShipper(shipper)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        shipperService.deleteShipper(id);
        return ResponseEntity.ok(new ResponseData("success", "Deleted"));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Shipper shipper) {
        return ResponseEntity.ok(new ResponseData("success", shipperService.updateShipper(id, shipper)));
    }
}