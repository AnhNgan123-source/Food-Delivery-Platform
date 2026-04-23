package com.nhom8.backend.controller;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.service.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;
    // Thư mục lưu ảnh nằm cùng cấp với thư mục src của Backend
    private static final String UPLOAD_DIR = "uploads/";

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    // 1. THÊM MỚI MÓN ĂN
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
            // --- Sửa lại cho khớp với MenuItem.java của Ngân ---
            item.setItemName(itemName); 
            item.setPrice(price);
            item.setDescription(description);
            item.setCatId(catId);
            item.setResId(resId);
            item.setIsAvailable(isAvailable);

            if (file != null && !file.isEmpty()) {
                // Dùng UUID để tên file không bao giờ bị trùng
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());

                item.setItemImage(fileName); // Lưu tên file vào DB
            }

            MenuItem savedItem = menuItemService.createMenuItem(item);
            return ResponseEntity.ok(savedItem);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 2. CẬP NHẬT MÓN ĂN
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Integer id,
            @RequestParam("item_name") String itemName,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam("cat_id") Integer catId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            MenuItem newItemData = new MenuItem();
            // --- Sửa lại cho khớp với MenuItem.java của Ngân ---
            newItemData.setItemName(itemName);
            newItemData.setPrice(price);
            newItemData.setDescription(description);
            newItemData.setCatId(catId);

            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());

                newItemData.setItemImage(fileName); 
            } else {
                // Nếu không up ảnh mới, truyền null để Service biết giữ ảnh cũ
                newItemData.setItemImage(null);
            }

            MenuItem updatedItem = menuItemService.updateMenuItem(id, newItemData);
            return ResponseEntity.ok(updatedItem);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/restaurant/{resId}")
    public List<MenuItem> getMenu(@PathVariable Integer resId) {
        return menuItemService.getAllMenuByRestaurant(resId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Integer id) {
        return menuItemService.getMenuItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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