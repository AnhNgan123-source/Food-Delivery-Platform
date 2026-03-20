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
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;
    // Đường dẫn gốc lưu file
    private static final String UPLOAD_DIR = "uploads/";

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    // ✅ ĐÃ XÓA: Hàm getImage rườm rà (Vì WebConfig đã lo phần này)

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

                // ✅ SỬA: Chỉ lưu tên file (ví dụ: "abc.jpg") thay vì "/uploads/abc.jpg"
                item.setItem_image(fileName);
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
            newItemData.setItem_name(itemName);
            newItemData.setPrice(price);
            newItemData.setDescription(description);
            newItemData.setCat_id(catId);

            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());

                // ✅ SỬA: Lưu tên file mới
                newItemData.setItem_image(fileName);
            } else {
                // ✅ THÊM: Nếu không có file mới, set là null để Service biết là giữ nguyên ảnh
                // cũ
                newItemData.setItem_image(null);
            }

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