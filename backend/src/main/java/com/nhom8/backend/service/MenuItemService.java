package com.nhom8.backend.service;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    // Lấy menu theo nhà hàng
    public List<MenuItem> getMenuByRestaurant(Integer resId) {
        return menuItemRepository.findByResId(resId);
    }

    // Tạo món
    public MenuItem createMenuItem(MenuItem item) {
        return menuItemRepository.save(item);
    }

    // Cập nhật món
    public MenuItem updateMenuItem(Integer id, MenuItem newItem) {

        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        item.setItemName(newItem.getItemName());
        item.setPrice(newItem.getPrice());
        item.setDescription(newItem.getDescription());
        item.setItemImage(newItem.getItemImage());
        item.setCatId(newItem.getCatId());

        return menuItemRepository.save(item);
    }

    // Xóa món
    public void deleteMenuItem(Integer id) {
        menuItemRepository.deleteById(id);
    }

    // bật/tắt món
    public MenuItem toggleAvailability(Integer id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tim thấy món"));

        if (item.getIsAvailable() == 1) {
            item.setIsAvailable(0);
        } else {
            item.setIsAvailable(1);
        }

        return menuItemRepository.save(item);
    }
}