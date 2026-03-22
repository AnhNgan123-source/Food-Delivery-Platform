package com.nhom8.backend.controller;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Thêm mới

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1")
public class RestaurantController {

    private final RestaurantService restaurantService;
  
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

    // --- PHẦN THÊM MỚI: XỬ LÝ UPLOAD HÌNH ẢNH ---

    /**
     * API Upload hình ảnh vào thư mục backend/uploads/
     * Path: POST /api/v1/restaurant/upload
     */
    @PostMapping("/restaurant/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng chọn một file để upload.");
        }

        try {
            // Định nghĩa đường dẫn lưu file (thư mục 'uploads' ở gốc project backend)
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);

            // Tự động tạo thư mục nếu chưa có
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file ngẫu nhiên để không bị ghi đè (UUID)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Copy file vào thư mục đích
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Trả về tên file để React lưu vào Database (resImage)
            return ResponseEntity.ok(fileName);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Không thể lưu file: " + e.getMessage());
        }
    }
}