package com.nhom8.backend.controller;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.service.MenuItemService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg"))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(
            @RequestParam("item_name") String itemName,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam("cat_id") Integer catId,
            @RequestParam("res_id") Integer resId,
            @RequestParam("is_available") Integer isAvailable,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            MenuItem item = new MenuItem();
            item.setItem_name(itemName);
            item.setPrice(price);
            item.setDescription(description);
            item.setCat_id(catId);
            item.setRes_id(resId);
            item.setIs_available(isAvailable);

            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                item.setItem_image("/uploads/" + fileName);
            }

            MenuItem savedItem = menuItemService.createMenuItem(item);
            return ResponseEntity.ok(savedItem);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/restaurant/{resId}")
    public List<MenuItem> getMenu(@PathVariable Integer resId) {
        return menuItemService.getAllMenuByRestaurant(resId);
    }

    // ✅ HÀM CẬP NHẬT MÓN ĂN (ĐÃ SỬA ĐỂ KHÔNG MẤT CODE VÀ HỖ TRỢ UP ẢNH)
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Integer id,
            @RequestParam("item_name") String itemName,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam("cat_id") Integer catId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            // Tạo object tạm để chứa dữ liệu mới gửi lên
            MenuItem newItemData = new MenuItem();
            newItemData.setItem_name(itemName);
            newItemData.setPrice(price);
            newItemData.setDescription(description);
            newItemData.setCat_id(catId);

            // Xử lý file nếu có upload ảnh mới
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                newItemData.setItem_image("/uploads/" + fileName);
            }

            // Gọi service để update (Service sẽ giữ nguyên các trường khác như res_id,
            // is_available)
            MenuItem updatedItem = menuItemService.updateMenuItem(id, newItemData);
            return ResponseEntity.ok(updatedItem);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable Integer id) {
        menuItemService.deleteMenuItem(id);
    }

    @PutMapping("/{id}/toggle")
    public MenuItem toggleAvailability(@PathVariable Integer id) {
        return menuItemService.toggleAvailability(id);
    }
}