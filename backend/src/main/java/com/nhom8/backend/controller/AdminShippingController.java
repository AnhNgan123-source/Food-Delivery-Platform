package com.nhom8.backend.controller;

import com.nhom8.backend.model.ShippingConfig;
import com.nhom8.backend.service.ShippingConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/admin/shipping-config") 
public class AdminShippingController {

    @Autowired
    private ShippingConfigService shippingService;

    /*
     * Lấy danh sách cấu hình phí ship
     * GET /api/v1/admin/shipping-config
     */
    @GetMapping
    public List<ShippingConfig> getShippingConfigs() {
        return shippingService.getAllConfigs();
    }

    /*
     * Cập nhật phí ship hàng loạt (Nội thành & Ngoại thành)
     * POST /api/v1/admin/shipping-config
     */
    @PostMapping
    public ResponseEntity<String> updateShippingConfigs(@RequestBody List<ShippingConfig> configs) {
        try {
            shippingService.updateConfigs(configs);
            return ResponseEntity.ok("Cập nhật phí ship thành công!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}