package com.nhom8.backend.controller;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.service.MenuItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    // Lấy menu của nhà hàng
    @GetMapping("/restaurant/{resId}")
    public List<MenuItem> getMenu(@PathVariable Integer resId) {
        return menuItemService.getMenuByRestaurant(resId);
    }

    // Tạo món mới
    @PostMapping
    public MenuItem createMenuItem(@RequestBody MenuItem item) {
        return menuItemService.createMenuItem(item);
    }

    // Cập nhật món
    @PutMapping("/{id}")
    public MenuItem updateMenuItem(@PathVariable Integer id,
            @RequestBody MenuItem item) {
        return menuItemService.updateMenuItem(id, item);
    }

    // Xóa món
    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable Integer id) {
        menuItemService.deleteMenuItem(id);
    }

    // Bật/tắt món
    @PutMapping("/{id}/toggle")
    public MenuItem toggleAvailability(@PathVariable Integer id) {
        return menuItemService.toggleAvailability(id);
    }

}