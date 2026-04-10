package com.nhom8.backend.controller;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.model.Shipper;
import com.nhom8.backend.service.RestaurantService;
import com.nhom8.backend.repository.RestaurantRepository;
import com.nhom8.backend.repository.ShipperRepository; // Thêm mới

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List; // Thêm mới
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ShipperRepository shipperRepository; // Inject để quán quản lý shipper

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/restaurant/owner/{ownerId}")
    public ResponseEntity<?> getRestaurant(@PathVariable Integer ownerId) {
        Restaurant res = restaurantService.getRestaurantByOwner(ownerId);
        if (res != null) {
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/restaurant/{id}")
    public ResponseEntity<?> ownerUpdateRestaurant(@PathVariable Integer id,
            @RequestBody Restaurant restaurantDetails) {
        try {
            Restaurant updatedRes = restaurantService.updateRestaurant(id, restaurantDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Thông tin quán đã được cập nhật!");
            response.put("data", updatedRes);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/restaurant/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng chọn một file để upload.");
        }

        try {
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(fileName);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Không thể lưu file: " + e.getMessage());
        }
    }

    // --- PHẦN QUẢN LÝ SHIPPER DÀNH CHO NHÀ HÀNG ---

    /**
     * Lấy danh sách shipper thuộc quyền quản lý của quán
     */
    @GetMapping("/restaurant/{resId}/shippers")
    public ResponseEntity<?> getShippersByRestaurant(@PathVariable Integer resId) {
        List<Shipper> shippers = shipperRepository.findByRestaurantResId(resId);
        return ResponseEntity.ok(new HashMap<String, Object>() {{
            put("status", "success");
            put("data", shippers);
        }});
    }

    /**
     * Cập nhật trạng thái shipper (Ví dụ: Quán tự set Shipper nghỉ hoặc đi giao)
     */
    @PutMapping("/restaurant/shipper/{shipperId}/status")
    public ResponseEntity<?> updateShipperStatus(@PathVariable Integer shipperId, @RequestParam Shipper.ShipperStatus status) {
        return shipperRepository.findById(shipperId).map(shipper -> {
            shipper.setStatus(status);
            shipperRepository.save(shipper);
            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("status", "success");
                put("message", "Trạng thái shipper đã cập nhật");
            }});
        }).orElse(ResponseEntity.notFound().build());
    }
}